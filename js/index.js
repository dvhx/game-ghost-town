// main window
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST

var SC = window.SC || {}

SC.canvas1 = null;
SC.context1 = null;
SC.canvas2 = null;
SC.context2 = null;
SC.w = 640;
SC.h = 400;
SC.zoom = 2;
SC.sw = Math.ceil(SC.w / 16 / SC.zoom);
SC.sh = Math.ceil(SC.h / 16 / SC.zoom);
SC.inInput = false;
SC.frame = 0;
SC.subFrame = 0;
SC.totalRenderingTime = 0; // Total rendering time in ms
SC.startTime = new Date();
SC.walkableEverything = false;

function purge() {
    SC.storage.eraseAll();
    document.location.reload();
}

SC.onResize = function () {
    // resize window
    // canvas
    console.log('resize', window.innerWidth, window.innerHeight);
    SC.w = window.innerWidth;
    SC.h = window.innerHeight;
    SC.sw = Math.floor(SC.w / 16 / SC.zoom);
    SC.sh = Math.floor(SC.h / 16 / SC.zoom);
    // bg
    SC.canvas1.width = SC.w;
    SC.canvas1.height = SC.h;
    SC.canvas1.style.width = SC.w + 'px';
    SC.canvas1.style.height = SC.h + 'px';
    SC.context1.imageSmoothingEnabled = false;
    // fg
    SC.canvas2.width = SC.w;
    SC.canvas2.height = SC.h;
    SC.canvas2.style.width = SC.w + 'px';
    SC.canvas2.style.height = SC.h + 'px';
    SC.context2.imageSmoothingEnabled = false;
    // redraw
    if (SC.renderSafe && SC.map) {
        SC.player.center(true);
        SC.renderSafe();
    }
};

SC.renderSafeKey = '';

SC.renderSafe = function () {
    // this will only call render if something changed
    var key = [SC.player.x, SC.player.y, SC.player.dir, SC.player.sx, SC.player.sy, SC.w, SC.h].join(',');
    if (key !== SC.renderSafeKey) {
        SC.renderSafeKey = key;
        window.requestAnimationFrame(SC.renderDoNotCallDirectly);
    }
};

SC.renderDoNotCallDirectly = function () {
    // render everything
    //console.log('SC.renderDoNotCallDirectly', SC.player.x, SC.player.y, SC.player.dir);
    var t1 = new Date(), t2, x, y, w, h, l, t, debug, xy, edge, names;
    if (!SC.tilesReady || !SC.context1) {
        return;
    }
    // clear canvas
    SC.frame++;
    SC.context1.clearRect(0, 0, SC.w, SC.h);

    // font for edge info
    SC.context1.fillStyle = 'yellow';
    SC.context1.font = "16pt sans-serif";
    SC.context1.textBaseline = 'top';

    // ground
    l = Math.floor(SC.player.sx);
    t = Math.floor(SC.player.sy);
    w = Math.floor(SC.w / 16 / SC.zoom);
    h = Math.floor(SC.h / 16 / SC.zoom);
    if (SC.map.ground) {
        for (y = t; y < t + h + 1; y++) {
            for (x = l; x < l + w + 1; x++) {
                if (x >= 0 && y >= 0 && y < SC.map.ground.length && x < SC.map.ground[0].length) {
                    names = SC.map.ground[y][x];
                    if (SC.walkableEverything) {
                        xy = x + ' ' + y;
                        debug = '';
                        debug += SC.map.event.hasOwnProperty(xy) ? 'E' : '';
                        debug += SC.map.place.hasOwnProperty(xy) ? 'P' : '';
                        edge = SC.map.layer.edge[y][x];
                        if (edge > 0) {
                            names = names.slice();
                            SC.type.isString(SC.edgeTileName[edge], edge, 'Cannot render edge tile for ' + edge);
                            names.push(SC.edgeTileName[edge]);
                        }
                    }
                    SC.tile(SC.context1, names, x - l, y - t, debug);
                }
            }
        }
    }

    // npcs
    SC.npcs.render();

    // player
    SC.player.render();

    // captions
    SC.caption.render();

    // bubbles
    SC.bubbles.render(SC.bubbles.bubbles.length > 0);

    // measure speed
    t2 = new Date();
    SC.totalRenderingTime += t2 - t1;
};

SC.fullRedraw = function () {
    // forced full redraw, used only after special commands, not walking
    SC.context2.clearRect(0, 0, SC.w, SC.h);
    SC.bubbles.render(true);
    SC.renderSafeKey = '';
    SC.renderSafe();
};

SC.onToolQuests = function () {
    // Show quests
    if (SC.oldQuests) {
        SC.oldQuests.hide();
        SC.oldQuests = null;
    }
    SC.oldQuests = SC.quests.show();
};

SC.onToolIntro = function () {
    // Show intro
    SC.cmd.run('#intro');
};

SC.onNewQuest = function () {
    var hint_quest = document.getElementById('hint_quest');
    hint_quest.style.display = 'block';
    setTimeout(function () {
        hint_quest.style.opacity = 1;
    }, 100);
    setTimeout(function () {
        hint_quest.style.opacity = 0;
    }, 3000);
    setTimeout(function () {
        hint_quest.style.display = 'none';
    }, 3500);
};

window.addEventListener('DOMContentLoaded', function () {
    // initialize window
    SC.canvas1 = document.getElementById('canvas1');
    SC.context1 = SC.canvas1.getContext('2d');
    SC.canvas2 = document.getElementById('canvas2');
    SC.context2 = SC.canvas2.getContext('2d');
    // restore saved values
    SC.cmd.loadHistory();
    if (SC.touch.enabled) {
        SC.cmd.show();
    }
    SC.init.await('tileset', SC.player.load);
    SC.walkableEverything = SC.storage.readBoolean('SC.walkableEverything', false);
    SC.touch.enabled = SC.storage.readBoolean('SC.touch.enabled', SC.isTouchDevice());

    // restore previous zoom
    SC.cmd.run('#zoom ' + SC.storage.readNumber('SC.zoom', SC.zoom));

    // window resize event
    window.addEventListener('resize', SC.onResize);

    // show intro
    SC.cmd.run('#shortcut F1 #intro');
    if (SC.storage.readBoolean('SC.intro.enabled', true)) {
        SC.init.await('tileset', function () {
            SC.cmd.run('#hk #intro');
        });
    }

    // first command
    if (SC.storage.keyExists('SC.rc')) {
        SC.cmd.run(SC.storage.readString('SC.rc'));
    }

    SC.init.done('SC.window');
    //SC.patreonDaily(5);

    // quests
    document.getElementById('tool_quests').addEventListener('click', SC.onToolQuests);
    SC.quests.callbackNewQuest = SC.onNewQuest;
    SC.quests.add('herb', 'Help Ken find cure for Kim');
    document.getElementById('tool_intro').addEventListener('click', SC.onToolIntro);

    // GT slang
    GHOST.slang.tocks = GHOST.slang.tocks || "rocks";

    console.log('Normal start');
});

SC.performance = function () {
    // show some performance info
    console.log(
        'frame:',
        SC.frame,
        'subFrame:',
        SC.subFrame,
        'fullFrame:',
        SC.frame - SC.subFrame,
        'totalRenderingTime(ms):',
        SC.totalRenderingTime,
        'sw:',
        SC.sw,
        'sh:',
        SC.sh,
        'fps:',
        (SC.frame / (SC.totalRenderingTime / 1000)).toFixed(1)
    );
};

