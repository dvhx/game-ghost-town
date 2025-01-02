// Speech bubbles manager
"use strict";
// globals: document, window, setTimeout, setInterval

var SC = window.SC || {}

SC.bubbles = (function () {
    // Speech bubbles manager
    var self = {};
    self.minShowDistance = 6;
    self.frames = 0;
    self.bubbles = [];
    self.canvas = document.getElementById('canvas_bubbles');
    self.context = self.canvas.getContext('2d');
    self.reserved = {};
    self.history = [];

    // offset text on firefox
    self.ff = 0;
    if (window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        self.ff = 2;
    }

    // bubble under toolbar fix
    self.toolbarWidth = document.getElementById('toolbar').clientWidth;
    //self.canvas.style.boxSizing = 'border-box';
    //self.canvas.style.borderRight = '48px solid red';
    //self.canvas.style.paddingRight = '48px';

    self.measuredFontHeightsCache = {};

    self.measureCanvasFontHeight = function (aFontSizePx, aFontName, aText, aBytesPerPixel, aDebug) {
        // Measure real font height, because context.measureText only returns width

        // use cached value?
        if (self.measuredFontHeightsCache.hasOwnProperty(aFontSizePx + ' ' + aFontName)) {
            return self.measuredFontHeightsCache[aFontSizePx + ' ' + aFontName];
        }
        console.log('mcfh');

        var can, ctx, d, i, y, sample, bpp;
        sample = aText || 'AaGgYyQq|"~\'Ž';
        bpp = aBytesPerPixel || 4; // RGBA = 4 bpp

        // remove canvas from previous measurement
        can = document.getElementById('measureCanvasFontHeightCanvas');
        if (can) {
            can.parentElement.removeChild(can);
        }

        // prepare canvas
        can = document.createElement('canvas');
        ctx = can.getContext('2d');
        ctx.font = aFontSizePx + 'px ' + aFontName;
        can.width = Math.ceil(ctx.measureText(sample).width);
        can.height = 2 * aFontSizePx;
        // when canvas is resized font must be set again
        ctx.font = aFontSizePx + 'px ' + aFontName;

        // draw sample text from top
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'red';
        ctx.fillText(sample, 0, 0);

        // get pixels array
        d = ctx.getImageData(0, 0, can.width, can.height).data;

        // find first non-black pixel from the bottom
        y = can.height;
        for (i = d.length; i > 0; i--) {
            if (d[i] > 0) {
                y = Math.ceil(i / (can.width * bpp));
                break;
            }
        }
        if (y >= can.height) {
            console.error('Cannot determine font height: ' + ctx.font);
        }

        // show canvas for debugging
        if (aDebug) {
            can.id = 'measureCanvasFontHeightCanvas';
            ctx.strokeStyle = 'lime';
            ctx.beginPath();
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(can.width, y + 0.5);
            ctx.closePath();
            ctx.stroke();
            can.style.position = 'fixed';
            can.style.left = 0;
            can.style.top = 0;
            can.style.border = '1px solid red';
            document.body.appendChild(can);
        }
        self.measuredFontHeightsCache[aFontSizePx + ' ' + aFontName] = y;

        return y;
    };

    self.resize = function () {
        // resize bubble canvas
        // console.log('bubble resize ', window.innerWidth, window.innerHeight);
        self.canvas.width = window.innerWidth;
        self.canvas.height = window.innerHeight;
        self.canvas.style.width = self.canvas.width + 'px';
        self.canvas.style.height = self.canvas.height + 'px';
        self.context.imageSmoothingEnabled = false;
    };
    window.addEventListener('resize', self.resize);
    self.resize();

    self.invervalOverlap = function (a, b, c, d) {
        // return true if inverval <a, b> overlap <c, d>
        return (c <= b) && (d >= a);
    };

    self.boundingBoxOverlap = function (a, b) {
        // return true if 2 bounding boxes {l,t,w,h} overlaps
        return (self.invervalOverlap(a.l, a.l + a.w, b.l, b.l + b.w) && self.invervalOverlap(a.t, a.t + a.h, b.t, b.t + b.h));
    };

    self.renderOne = function (aText, aX, aY, aColor, aPreviousBubble) {
        // draw speech bubble with text in in on certain position on canvas
        //console.log('bubble.render text:', aText, 'x:', aX, 'y:', aY);
        var x = aX + 0.5, y = aY + 0.5, d = 10, l, t, w, h, rowh, padding = 2,
            edge = 14, i, words, lines, wordwidth, linewidth, bounding_box, dy;
        self.context.font = '16px sans-serif';
        w = self.context.measureText(aText).width;
        h = self.measureCanvasFontHeight(16, 'sans-serif') + 2;
        rowh = h;

        // measure width of individual words, split long sentence to multiple lines to fit canvas
        words = aText.split(' ');
        lines = [];
        linewidth = 0;
        for (i = 0; i < words.length; i++) {
            wordwidth = self.context.measureText(words[i] + ' ').width;
            // wrap the line if word don't fit canvas
            if (linewidth + wordwidth + 2 * padding + 2 * edge > self.canvas.width - self.toolbarWidth) {
                lines.push('\n');
                linewidth = 0;
            }
            // append word to the line
            linewidth += wordwidth;
            lines.push(words[i]);
        }
        lines = lines.join(' ').split('\n');
        lines = lines.map(function (a) { return a.trim(); });
        //console.log(JSON.stringify(lines, undefined, 2));

        // measure height
        h = lines.length * rowh;

        // measure longest line
        w = 0;
        for (i = 0; i < lines.length; i++) {
            w = Math.max(self.context.measureText(lines[i]).width, w);
        }
        w = Math.round(w + 2 * padding);
        //console.log('line w max', w, 'canvas.width', self.canvas.width, 'h', h, 'lines', lines.length);

        // make sure it fits the canvas
        l = x - Math.round(w / 2);
        t = y - d - h;
        if (l < edge) {
            l = edge;
        }
        if (t < edge) {
            t = edge;
        }
        if (l + w + edge > self.context.canvas.width - self.toolbarWidth) {
            l = self.context.canvas.width - w - edge - self.toolbarWidth;
        }
        if (t + h + edge > self.context.canvas.height) {
            t = self.context.canvas.height - h - edge;
        }
        if (x < edge) {
            x = edge;
        }
        if (x > self.context.canvas.width - 2 * d - self.toolbarWidth) {
            x = self.context.canvas.width - 2 * d - self.toolbarWidth;
        }
        if (y < edge + h + d) {
            y = edge + h + d;
        }
        if (y > self.context.canvas.height) {
            y = self.context.canvas.height;
        }
        //console.log({ x: x, y: y, l: l, t: t, w: w, h: h, lines: lines });

        // resolve overlap with previous bubble
        // currently only 2 bubbles are supported
        bounding_box = { l: l, t: t, w: w, h: h};
        if (aPreviousBubble) {
            if (self.boundingBoxOverlap(aPreviousBubble, bounding_box)) {
                // move current up
                dy = t - (aPreviousBubble.t - h) + padding;
                t = t - dy;
                //y = y - dy;
            }
        }

        // bubble
        self.context.fillStyle = aColor || 'white';
        self.context.strokeStyle = 'black';
        self.context.lineWidth = 3;
        self.context.beginPath();
        //console.log('x', x, 'y', y, 't', t, 'w', w, 'h', h, 'l', l, 'd', d);
        self.context.moveTo(x, y);
        self.context.lineTo(x, t + h);
        self.context.lineTo(l, t + h);
        self.context.lineTo(l, t);
        self.context.lineTo(l + w, t);
        self.context.lineTo(l + w, t + h);
        self.context.lineTo(Math.min(l + w, x + d), t + h);
        self.context.closePath();
        self.context.stroke();
        self.context.fill();

        // text
        self.context.fillStyle = 'black';
        self.context.textBaseline = 'top';
        for (i = 0; i < lines.length; i++) {
            self.context.fillText(lines[i], l, t + i * rowh + self.ff);
        }

        // return bounding box for bubbles collision detection
        return bounding_box;
    };

    self.clear = function () {
        // clear context
        self.frames++;
        self.context.clearRect(0, 0, self.context.canvas.width, self.context.canvas.height);
        self.showToolbar(true);
    };

    self.clearForNick = function (aNick) {
        // clear only for one nick
        var i;
        for (i = self.bubbles.length - 1; i >= 0; i--) {
            if (self.bubbles[i].nick.toLowerCase() === aNick.toLowerCase()) {
                self.bubbles.splice(i, 1);
            }
        }
        self.clear();
    };

    self.render = function (aNeedClear) {
        // render all bubles
        self.frames++;
        var i, y, close, previous;
        if (aNeedClear) {
            //console.info('SC.bubbles.clear', aNeedClear);
            self.clear();
        }
        self.showToolbar(self.bubbles.length <= 0);
        for (i = 0; i < self.bubbles.length; i++) {
            // only render close rpc
            close = (Math.abs(self.bubbles[i].x - SC.player.x) < self.minShowDistance)
                    && (Math.abs(self.bubbles[i].y - SC.player.y) < self.minShowDistance);
            if (close || self.bubbles[i].important) {
                //console.log(self.bubbles[i]);
                y = self.bubbles[i].y;
                //while (reserved.hasOwnProperty(y)) {
                //    y -= 0.5;
                //}
                //reserved[y] = true;
                previous = self.renderOne(
                    self.bubbles[i].text,
                    (self.bubbles[i].x - SC.player.sx + 0.5) * SC.zoom * 16,
                    (y - SC.player.sy) * SC.zoom * 16,
                    self.bubbles[i].color,
                    previous
                );
            }
        }
        //console.log('reserved', reserved);
    };

    self.hide = function (aNick) { // , aDebugInfo
        // hide bubbles too old
        var i, d = new Date(), r = false;
        for (i = self.bubbles.length - 1; i >= 0; i--) {
            //console.log(i, self.bubbles[i].t - d);
            if ((d - self.bubbles[i].t >= 10000) || (aNick && (self.bubbles[i].nick === aNick))) {
                //console.log('Hiding bubble d=', d, ' t=', self.bubbles[i].t, ' delta=', d - self.bubbles[i].t, ' text=', self.bubbles[i].text, ' nick=', aNick, ' di=', aDebugInfo);
                self.bubbles.splice(i, 1);
                r = true;
            }
        }
        if (r) {
            self.render(true);
        }
    };

    self.hideIfPlayerMoved = function () {
        // hide player bubble if player moved
        var i;
        for (i = self.bubbles.length - 1; i >= 0; i--) {
            if (self.bubbles[i].nick === 'Player') {
                //console.info(self.bubbles[i].text, self.bubbles[i].x, self.bubbles[i].y, 'p', SC.player.x, SC.player.y);
                if ((self.bubbles[i].x !== SC.player.x) || (self.bubbles[i].y !== SC.player.y)) {
                    self.hide('Player');
                    return;
                }
            }
        }
    };

    self.add = function (aNick, aText, aX, aY, aImportant) {
        // add new bubble
        //console.log('SC.bubbles.add', {nick: aNick, text: aText, x: aX, y: aY, important: aImportant});
        // remove previous bubbles from this nick
        var i;
        for (i = self.bubbles.length - 1; i >= 0; i--) {
            if (self.bubbles[i].nick === aNick) {
                self.bubbles.splice(i, 1);
            }
        }
        // add to history
        self.history.push({nick: aNick, text: aText, time: new Date()});
        // add
        self.bubbles.push({
            nick: aNick,
            text: aText,
            x: aX,
            y: aY,
            t: new Date(),
            color: aNick === 'Player' ? 'skyblue' : 'white',
            important: aImportant
        });

        // sort them by y then player first
        self.bubbles.sort(function (a, b) {
            if (a.y === b.y) {
                return a.nick === 'Player' ? -1 : 1;
            }
            return a.y - b.y;
        });

        self.render(true);
        setTimeout(self.hide, 11000); // Hide bubble after some time
    };

    self.showHistory = function () {
        // show recent conversations
        if (self.history.length <= 0) {
            SC.player.bubble('Nothing to read again');
            return;
        }
        var i, ar = SC.articles(), title, old_title = '';
        ar.issue(new Date());
        ar.line(true);
        for (i = 0; i < self.history.length; i++) {
            // make sure time is object
            self.history[i].time = typeof self.history[i].time === 'string' ? new Date(self.history[i].time) : self.history[i].time;
            title = SC.date.hhmm(self.history[i].time);
            if (title !== old_title) {
                if (i > 0) {
                    ar.br();
                    ar.line();
                }
                ar.title(title);
            }
            old_title = title;
            // comment
            if (self.history[i].nick) {
                ar.comment(self.history[i].nick, self.history[i].text);
            }
            // blink
            if (self.history[i].blink) {
                ar.blink(self.history[i].blink);
            }
        }
        SC.newspaperFromData('Recent speech', ar.main);
    };

    self.showToolbar = function () { // aVisible
        // make toolbar visible or not (to show bubbles);
        // bubble under toolbar fix v1
        //var toolbar = document.getElementById('toolbar');
        //toolbar.style.display = aVisible ? 'initial' : 'none';
        //console.log('SC.bubbles.showToolbar', aVisible);
        self.foo = true;
    };

    return self;
}());

