// Player's character
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.player = (function () {
    var self = {
        x: 49,       // last valid position, when you start moving this keeps unchanged until you successfully reach the center of next cell
        y: 50,
        xy: "49 50",  // combined player "x y" for events and places
        sx: 48,      // pan (upper left corner to make player in screen center)
        sy: 48,
        dir: 'down',
        base: 'boy',
        goBlockXY: null, // after GO command step events are blocked until player leave goBlockXY
        lock: false, // if true player movement is restricted, this is used to keep player on place of quest/event
        steps: {}    // all previous steps and times, used to prevent multiple same calls of onStep event, key is "x y dir", value is milliseconds since epoch
    },
        rx = 0,      // real position including small steps in between 2 cells
        ry = 0,
        clip = {x: 0, y: 0, w: 0, h: 0 }, // clipping rectangle under player, used for faster walking rendering
        speed = 0.25,
        dx = 0,      // direction where player is moving, can be +/- speed
        dy = 0,
        centerThreshold = Android.isReal() ? 1 : 2,
        skipMoves = 0; // when user press key, this will be increased by 1 so that next regular update is skipped otherwise pushing keys would make player walk faster

    self.goto = function (aX, aY, aBlock) { // aMap
        // teleport player to position to a map
        console.info('SC.player.goto', aX, aY, aBlock);
        self.x = aX;
        self.y = aY;
        SC.map.constraint(SC.player);
        self.xy = aX + ' ' + aY;
        if (aBlock) {
            self.goBlockXY = self.xy;
        }
        rx = aX;
        ry = aY;
        // self.sx = ?
        // self.sy = ?
        dx = 0;
        dy = 0;
    };

    self.keepWithinMap = function () {
        // keep coordinates within map
        if (SC.map && SC.map.constraint(self)) {
            self.goto(self.x, self.y);
        }
    };

    self.save = function () {
        // save player's position to storage
        // prevent saving in obviously wrong position
        if (self.x === 0 && self.y === 0) {
            return;
        }
        var o = {
            x: self.x,
            y: self.y,
            map: SC.map.name,
            base: self.base
        };
        SC.storage.writeObject('SC.player', o);
    };

    self.load = function () {
        // load player's position from storage
        var o = SC.storage.readObject('SC.player', { x: 48, y: 50, map: "ghosttown", base: "boy" });
        console.log('SC.player.load', o);
        SC.map.load(o.map || 'ghosttown');
        self.base = o.base || "boy";
        self.goto(o.x, o.y, o.map);
        // self.center();
        SC.onResize();
        // finish pending transactions
        SC.transaction.executePending();
    };

    self.center = function (aForceCenter) {
        // show player in center of screen
        //console.info('SC.player.center', aForceCenter);
        if (aForceCenter) {
            self.sx = Math.round(self.x - SC.sw / 2);
            self.sy = Math.round(self.y - SC.sh / 2);
            return;
        }
        // first test if it is necessary
        var osx = self.sx,
            osy = self.sy,
            q = Math.floor(SC.sw / 2);
        // x
        if (Math.floor(self.x) < Math.floor(self.sx) + centerThreshold) {
            self.sx = Math.floor(self.x) - q;
        }
        if (Math.floor(self.x) > Math.floor(self.sx) + SC.sw - (centerThreshold + 1)) {
            self.sx = Math.floor(self.x) - SC.sw + q + 1;
        }
        // y
        q = Math.floor(SC.sh / 2);
        if (Math.floor(self.y) < Math.floor(self.sy) + centerThreshold) {
            self.sy = Math.floor(self.y) - q;
        }
        if (Math.floor(self.y) > Math.floor(self.sy) + SC.sh - (centerThreshold + 1)) {
            self.sy = Math.floor(self.y) - SC.sh + q + 1;
        }
        // move it
        if ((osx !== self.sx) || (osy !== self.sy)) {
            SC.renderSafe();
        }
    };

    self.keyChange = function (aKey, aDown) {
        // is called when user press any key
        // arrows will change where player is looking
        if (aDown) {
            if (SC.bubbles) {
                SC.bubbles.hide('Player', 'SC.player.keyChange ' + aKey + ' d=' + aDown);
            }
            if (aKey === 'ArrowLeft') {
                self.turn('left');
            }
            if (aKey === 'ArrowRight') {
                self.turn('right');
            }
            if (aKey === 'ArrowUp') {
                self.turn('up');
            }
            if (aKey === 'ArrowDown') {
                self.turn('down');
            }
        }
    };

    self.changeDxDy = function (aKey) {
        // the only time dx,dy change is allowed is when I am at center of cell
        self.keepWithinMap();
        if (self.x === undefined) {
            console.warn('some weird bug, should not happen anymore');
            return;
        }
        if (!SC.map) {
            return;
        }
        if (!SC.map.edge) {
            return;
        }
        if (self.lock) {
            return;
        }
        if ((rx === self.x) && (ry === self.y)) {
            var edge = SC.map.edge && SC.map.edge[self.y][self.x];
            if (SC.walkableEverything) {
                edge = 0;
            }
            dx = 0;
            dy = 0;
            if (SC.keyboard.key.ArrowLeft || (aKey === 'ArrowLeft')) {
                if (!(edge & 1)) {
                    self.dir = 'left';
                    dx = -speed;
                }
            }
            if (SC.keyboard.key.ArrowRight || (aKey === 'ArrowRight')) {
                if (!(edge & 2)) {
                    self.dir = 'right';
                    dx = speed;
                }
            }
            if (SC.keyboard.key.ArrowUp || (aKey === 'ArrowUp')) {
                if (!(edge & 4)) {
                    self.dir = 'up';
                    dy = -speed;
                }
            }
            if (SC.keyboard.key.ArrowDown || (aKey === 'ArrowDown')) {
                if (!(edge & 8)) {
                    self.dir = 'down';
                    dy = speed;
                }
            }
        }
    };

    self.allowedMove = function (aOldX, aOldY, aNewX, aNewY) {
        // return true if diagonal movement is allowed (e.g. not into corner of building)
        // ortogonal movements are not checked because they are simple and are checked elsewhere
        var LEFT = 1, RIGHT = 2, UP = 4, DOWN = 8;

        // when locked no allowed move
        if (self.lock) {
            return false;
        }

        // prevent moving out of map
        if ((aNewX < 0) || (aNewY < 0) || (aNewX > SC.map.width - 1) || (aNewY > SC.map.height - 1)) {
            return false;
        }

        // wall hack
        if (SC.walkableEverything) {
            return true;
        }

        // to right up
        if ((aOldX === aNewX - 1) && (aOldY === aNewY + 1)) {
            if ((SC.map.edge[aOldY][aNewX] & UP) || (SC.map.edge[aNewY][aOldX] & RIGHT)) {
                return false;
            }
        }

        // to right down
        if ((aOldX === aNewX - 1) && (aOldY === aNewY - 1)) {
            if ((SC.map.edge[aOldY][aNewX] & DOWN) || (SC.map.edge[aNewY][aOldX] & RIGHT)) {
                return false;
            }
        }

        // to left down
        if ((aOldX === aNewX + 1) && (aOldY === aNewY - 1)) {
            if ((SC.map.edge[aOldY][aNewX] & DOWN) || (SC.map.edge[aNewY][aOldX] & LEFT)) {
                return false;
            }
        }

        // to left up
        if ((aOldX === aNewX + 1) && (aOldY === aNewY + 1)) {
            if ((SC.map.edge[aOldY][aNewX] & UP) || (SC.map.edge[aNewY][aOldX] & LEFT)) {
                return false;
            }
        }

        return true;
    };

    self.updateWalkAnimation = function (aKey) {
        // update player position if it is walking
        var moved = false, ax, ay, verticalStepAside, horizontalStepAside, a, b;

        if (skipMoves > 0) {
            skipMoves--;
            return;
        }
        if (!SC.map) {
            return;
        }

        // change dx,dy if allowed
        self.changeDxDy(aKey);

        // move by dx,dy
        if (!self.lock) {
            if ((dx !== 0) || (dy !== 0)) {
                rx += dx;
                ry += dy;
                moved = true;
            }
        }

        // update x,y when we reached new cell center
        ax = self.x;
        ay = self.y;
        if (Math.round(rx) === rx && self.x !== rx) {
            ax = Math.round(rx);
            // stop if left/right not pressed
            if (!SC.keyboard.key.ArrowLeft && !SC.keyboard.key.ArrowRight) {
                dx = 0;
            }
        }
        if (Math.round(ry) === ry && self.y !== ry) {
            ay = Math.round(ry);
            // stop if up/down not pressed
            if (!SC.keyboard.key.ArrowUp && !SC.keyboard.key.ArrowDown) {
                dy = 0;
            }
        }
        // if we moved to new position check if such move is legal
        if ((ax !== self.x) || (ay !== self.y)) {
            if (self.allowedMove(self.x, self.y, ax, ay)) {
                self.x = ax;
                self.y = ay;
                self.xy = ax + ' ' + ay;
                self.onStep();
            } else {
                // if move is not allowed move it back

                verticalStepAside = function () {
                    // vertical step aside
                    var r = self.allowedMove(self.x, self.y, self.x, ay);
                    if (!r) {
                        return false;
                    }
                    self.y = ay;
                    self.xy = self.x + ' ' + self.y;   // ax + ...
                    rx = self.x;
                    ry = self.y;
                    self.onStep();
                    return true;
                };

                horizontalStepAside = function () {
                    // horizontal step aside
                    var r = self.allowedMove(self.x, self.y, ax, self.y);
                    if (!r) {
                        return false;
                    }
                    self.x = ax;
                    self.xy = ax + ' ' + self.y;
                    rx = self.x;
                    ry = self.y;
                    self.onStep();
                    return true;
                };

                // prefer vertical to make entrance easier
                a = verticalStepAside;
                b = horizontalStepAside;
                // but when touch pad is mostly horizontal, switch the prefference
                if (Math.abs(SC.touch.lx) > Math.abs(SC.touch.ly)) {
                    a = horizontalStepAside;
                    b = verticalStepAside;
                }

                if (!a()) {
                    if (!b()) {
                        rx = self.x;
                        ry = self.y;
                    }
                }
            }
            self.changeDxDy(aKey);
        }

        // render walking player
        if (moved || aKey) {
            window.requestAnimationFrame(self.render);
        }

        // if not moving now but last player tile was walking do one more render to stand
        if (!moved && self.walking) {
            window.requestAnimationFrame(self.render);
        }
    };

    self.render = function () {
        // only redraw tile, nothing else
        //console.warn('SC.player.render', self.x, self.y, self.dir, clip);

        // clear previous tile
        SC.context2.clearRect(clip.x, clip.y, clip.w, clip.h);

        // decide walking tile
        SC.frame++;
        var s = '-walk' + (1 + SC.frame % 2);
        if ((dx === 0) && (dy === 0)) {
            s = '';
        }

        // draw tile
        clip = SC.tile(SC.context2, [self.base + '-' + self.dir + s], rx - self.sx, ry - self.sy, null, 1);
    };

    self.initializeIntervals = function () {
        // initialize 2 intervals used for walking
        setInterval(self.updateWalkAnimation, 100); // Animation of player movements

        // detect stop of walking
        self.stopWalkingHash = '';
        setInterval(function () {   // Timer to detect when player stop walking
            var k = SC.keyboard.key.ArrowLeft || SC.keyboard.key.ArrowRight || SC.keyboard.key.ArrowUp || SC.keyboard.key.ArrowDown,
                h = [self.x, self.y, dx, dy].join(',');
            if (!SC.renderSafe) {
                return;
            }
            //console.log(k, h, self.stopWalkingHash);
            if (!k && (dx === 0) && (dy === 0) && (h !== self.stopWalkingHash)) {
                self.stopWalkingHash = h;
                //console.info('STOP', h);
                self.onStopWalking();
            }
        }, 1000);
    };
    SC.init.await('SC.wallet,tileset,SC.window', self.initializeIntervals);

    self.onStopWalking = function () {
        // this is called when player stops walking or turning
        //console.warn('SC.player.onStopWalking', self.x, self.y, SC.keyboard.key.ArrowLeft, SC.keyboard.key.ArrowRight, SC.keyboard.key.ArrowUp, SC.keyboard.key.ArrowDown);
        self.center(true);
        SC.renderSafe();
        self.onStep();
        self.save();
    };

    self.onTags = function (aTags, aNpc) {
        // when player receive tags in answer of npc
        // note that tags may not be used immediately but later, e.g. in #require command on map's step event
        console.info('SC.player.onTags', aTags, 'npc', aNpc);
        // simply add them to inventory
        var t;
        for (t = 0; t < aTags.length; t++) {
            if (aTags[t].charAt(0) === '#') {
                SC.cmd.run(aTags[t]);
            } else {
                // older version simply added tags to inventory
                console.warn('deprecated: tags now support commands, use commands instead of goods name: ', aTags[t]);
                if (SC.goods.hasOwnProperty(aTags[t])) {
                    SC.inventory.add(aTags[t], 1);
                }
            }
        }
    };

    self.onStep = function () {
        // this is called when player steps on a new cell
        //console.info('SC.player.onStep', self.xy);

        // no more step events in lock
        if (self.lock) {
            return;
        }

        // prevent very fast multiple calls of exactly the same step
        var step_key = self.xy + ' ' + self.dir,
            d = (new Date()).getTime();
        if (self.steps.hasOwnProperty(step_key) && (d - self.steps[step_key]) < 900) {
            return;
        }
        self.steps[step_key] = d;

        // hide bubbles
        SC.bubbles.hideIfPlayerMoved();
        //SC.bubbles.hide('Player', 'SC.player.onStep');

        // centering
        self.center();

        // after go blocking
        if (self.goBlockXY && (self.goBlockXY === self.xy)) {
            console.info('go blocking!', self.goBlockXY, self.xy);
            return;
        }
        self.goBlockXY = null; //self.xy;

        // step event
        if (!SC.walkableEverything) {
            if (SC.map && SC.map.event && SC.map.event.hasOwnProperty(self.xy)) {
                console.info('step event', SC.map.event[self.xy]);
                SC.cmd.run(SC.map.event[self.xy]);
            }
        }
    };

    self.bubble = function (aText) {
        // let player say something
        SC.bubbles.add('Player', aText, self.x, self.y, true);
    };

    self.turn = function (aDirection) {
        // turn player
        if (self.dir !== aDirection) {
            self.dir = aDirection;
            // allow turning on stairs without changing map
            if (SC.map.event[self.xy] && (!SC.map.event[self.xy].match(/\bgoto\b/))) {
                self.onStep();
            }
            self.render();
        }
    };

    return self;
}());

