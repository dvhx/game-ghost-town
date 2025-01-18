// Rendering info caption on top of the screen (e.g. name of the building)
"use strict";
// globals: document, window, setTimeout, setInterval

var SC = window.SC || {};

SC.caption = (function () {
    var self = {}, canvas, context, previous;

    // captions will be on same canvas as bubbles
    window.addEventListener('DOMContentLoaded', function () {
        canvas = document.getElementById('canvas_bubbles');
        context = canvas.getContext('2d');
    });

    self.clearPrevious = function () {
        // Clear previous caption
        //console.info('SC.caption.clearPrevious');
        if (previous) {
            context.clearRect(
                previous.x,
                previous.y,
                previous.w,
                previous.h
            );
            previous = null;
        }
    };

    self.add = function (aCaption) {
        // render caption on top of the screen
        self.clearPrevious();
        context.fillStyle = 'white';
        context.font = "16pt sans-serif";
        context.fillStyle = "rgba(0,0,0,1)";
        context.textBaseline = 'middle';
        var
            c = Math.round(SC.sw / 2) - 1,
            w = 1,
            x = c,
            tw = context.measureText(aCaption).width,
            i,
            ex,
            ey,
            ew,
            eh,
            fs = 16;

        // smaller font at zoom 1
        if (SC.zoom === 1) {
            fs = 10;
            context.font = fs + "pt sans-serif";
            tw = context.measureText(aCaption).width;
        }

        // smaller font if text is too long
        while ((tw > 150) && (fs > 5)) {
            fs--;
            context.font = fs + "pt sans-serif";
            tw = context.measureText(aCaption).width;
        }

        // find text center
        while (tw > w * 16 * SC.zoom + 2 * 3) {
            w += 2;
            x = c - w / 2;
        }

        // draw caption bevel using 3 caption tiles
        SC.tile(context, ['captionleft'], x, 0);
        for (i = x + 1; i < x + w; i++) {
            SC.tile(context, ['caption'], i, 0);
        }
        SC.tile(context, ['captionright'], x + w, 0);

        // get exact coordinates of caption
        ex = x * 16 * SC.zoom;
        ey = 0;
        ew = (w + 1) * 16 * SC.zoom;
        eh = 16 * SC.zoom;
        previous = {
            x: ex,
            y: ey,
            w: ew,
            h: eh,
            c: aCaption
        };

        // render text
        context.fillStyle = 'black';
        context.fillText(aCaption, ex + ew / 2 - tw / 2, ey + eh / 2);
        self.xy = SC.player.xy;
    };

    self.render = function () {
        // automatically render caption if it is necessary, hide if not
        if (previous && (self.xy !== SC.player.xy)) {
            // console.info('SC.caption.render', previous, self.xy, SC.player.xy);
            self.clearPrevious();
        }
    };

    return self;
}());

