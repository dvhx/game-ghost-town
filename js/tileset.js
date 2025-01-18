// Rendering individual tiles from tileset
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator, Image

var SC = window.SC || {};

SC.tiles = {};

SC.tilesReady = false;

SC.init.await('map/tileset/tiny16.png,map/tileset/ghosttown.png', function () {
    // Mark tiles ready when all tiles were loaded
    SC.tilesReady = true;
    SC.init.done('tileset');
});

SC.tileset = function (aImageSrc, aTileNames) {
    // create one tileset
    var self = {}, x, y, n = 0;
    self.image = new Image();
    self.image.addEventListener('load', function () {
        //console.log(aTileNames);
        for (y = 0; y < aTileNames.length; y++) {
            for (x = 0; x < aTileNames[y].length; x++) {
                if (aTileNames[y][x]) {
                    SC.tiles[aTileNames[y][x]] = {
                        x: 16 * x,
                        y: 16 * y,
                        tileset: self.image
                    };
                    n++;
                }
            }
        }
        SC.init.done(aImageSrc);
        if (SC.renderSafe) {
            SC.renderSafe();
        }
        console.info(n, 'tiles in', aImageSrc);
    });
    self.image.src = aImageSrc;
};

SC.tile = function (aContext, aNames, aLeft, aTop, aDebug) {
    // render single tile
    var t, i,
        clip = {
            x: aLeft * 16 * SC.zoom,
            y: aTop * 16 * SC.zoom,
            w: 16 * SC.zoom,
            h: 16 * SC.zoom
        };
    //SC.assert(aNames.length <= 10, 'More than 10 tiles per cell is unusual, probably bug');
    SC.assert(aContext.canvas, 'First parameter must be context');
    SC.type.isArrayOfString(aNames, 'aNames');
    SC.assert(typeof aNames.push === 'function', 'Second parameter must be array');
    //console.log(aNames);
    for (i = 0; i < aNames.length; i++) {
        if (!aDebug && (aNames[i] === 'drop')) {
            continue;
        }
        t = SC.tiles[aNames[i]];
        SC.assert(t, 'Unknown tile name "' + aNames[i] + '" at ' + aLeft + ', ' + aTop);
        //console.log(aName, aLeft, aTop);
        aContext.drawImage(t.tileset || SC.tileset,
            t.x, t.y, 16, 16,
            aLeft * 16 * SC.zoom, aTop * 16 * SC.zoom,
            16 * SC.zoom, 16 * SC.zoom);
    }

    // debug label
    if (aDebug) {
        aContext.fillStyle = 'yellow';
        aContext.textBaseline = 'top';
        aContext.fillText(aDebug, clip.x, clip.y);
    }

    return clip;
};

SC.standAloneTile = function (aParent, aTiles) {
    // create canvas with stand alone tile, used e.g. in shop
    var canvas, context, oldzoom = SC.zoom;
    try {
        SC.zoom = 3;
        canvas = document.createElement('canvas');
        canvas.width = SC.zoom * 16;
        canvas.height = SC.zoom * 16;
        canvas.style.width = SC.zoom * 16 + 'px';
        canvas.style.height = SC.zoom * 16 + 'px';
        context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        SC.tile(context, aTiles, 0, 0);
        aParent.appendChild(canvas);
        return canvas;
    } finally {
        SC.zoom = oldzoom;
    }
};

SC.edgeTileName = {
    "258": "nowalk",
    "305": "nw_l_ud",
    "306": "nw__rud",
    "307": "nw_lru_",
    "308": "nw_lrud",
    "321": "nw_lr__",
    "322": "nw___ud",
    "323": "nw_lr_d",
    "337": "nw_l_u_",
    "338": "nw___u_",
    "339": "nw__ru_",
    "353": "nw_l___",
    "354": "nw_____",
    "355": "nw__r__",
    "369": "nw_l__d",
    "370": "nw____d",
    "371": "nw__r_d"
};
