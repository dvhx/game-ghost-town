// Procedural generator of transmutation circles
"use strict";
// globals: window, console, document

var SC = window.SC || {};

SC.transmutation = function (aCanvasOrId, aSpell) {
    var canvas = typeof aCanvasOrId === 'string' ? document.getElementById(aCanvasOrId) : aCanvasOrId,
        context = canvas.getContext('2d'),
        w = canvas.clientWidth,
        h = canvas.clientHeight,
        cx = w / 2,
        cy = h / 2,
        d = Math.min(w, h) / 2,
        twister = SC.twister(aSpell);
    canvas.width = w;
    canvas.height = h;
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(100, 30, 10, 0.8)';
    context.fillStyle = '#f6efe2';
    context.font = '32px sans-serif';
    context.textAlign = 'center';

    function circle(aX, aY, aRadius, aFill) {
        // draw circle
        context.beginPath();
        context.arc(aX, aY, aRadius, aRadius, 360);
        context.closePath();
        if (aFill) {
            context.fill();
        }
        context.stroke();
    }

    function symbol(aX, aY, aName) {
        // draw symbol
        context.fillStyle = 'rgba(100, 30, 10, 0.8)';
        context.textBaseline = 'middle';
        context.fillText(aName, aX, aY);
        context.fillStyle = '#f6efe2';
    }

    function triangle(aX, aY, aRadius, aRotation) {
        // draw triangle
        context.save();
        context.translate(aX, aY);
        context.rotate((aRotation || 0) / 180 * Math.PI);
        context.beginPath();
        context.moveTo(0, -aRadius);
        context.lineTo(aRadius / 1.17, aRadius / 2);
        context.lineTo(-aRadius / 1.17, aRadius / 2);
        context.closePath();
        context.stroke();
        context.restore();
    }

    function line(aX1, aY1, aX2, aY2) {
        // draw line
        context.beginPath();
        context.moveTo(aX1, aY1);
        context.lineTo(aX2, aY2);
        context.closePath();
        context.stroke();
    }

    function nside(aX, aY, aSides, aRadius, aRotation, aInnerLines) {
        // draw n-side polygon (e.g. box, pentagram)
        var i, a, x1, y1, x2, y2;
        for (i = 0; i < aSides + 1; i++) {
            a = 360 * i / aSides + aRotation;
            x1 = aX + aRadius * Math.sin(Math.PI * a / 180);
            y1 = aY + aRadius * Math.cos(Math.PI * a / 180);
            if (aInnerLines && i < aSides) {
                line(aX, aY, x1, y1);
            }
            if (i > 0) {
                line(x2, y2, x1, y1);
            }
            x2 = x1;
            y2 = y1;
        }
    }

    function lineClock(aX, aY, aAngle, aMin, aMax) {
        // draw line from center to outside
        line(
            aX + aMin * Math.sin(Math.PI * aAngle / 180),
            aY + aMin * Math.cos(Math.PI * aAngle / 180),
            aX + aMax * Math.sin(Math.PI * aAngle / 180),
            aY + aMax * Math.cos(Math.PI * aAngle / 180)
        );
    }

    function clock(aX, aY, aSegments, aMin, aMax) {
        // draw clock lines
        var i, a;
        for (i = 0; i < aSegments; i++) {
            a = 360 * i / aSegments;
            lineClock(aX, aY, a, aMin, aMax);
        }
    }

    function offCenter(aAngle, aDistance) {
        // move coordinates off center
        var a = Math.PI * aAngle / 180;
        context.translate(aDistance * Math.sin(a), aDistance * Math.cos(a));
    }

    function around(aDistance, aCount, aRotation, aCallback) {
        // move around center and call callback there
        var i, a;
        for (i = 0; i < aCount; i++) {
            a = Math.PI * (i * 360 / aCount + aRotation) / 180;
            context.save();
            context.translate(aDistance * Math.sin(a), aDistance * Math.cos(a));
            aCallback(i * 360 / aCount);
            context.restore();
        }
    }

    function randomDistance() {
        // get random distance
        return d * twister.randomInt(1, 9) / 10;
    }

    function randomRotation90() {
        // get random rotation 0-90 degrees
        return twister.randomInt(0, 9) * 10;
    }

    function randomAngle() {
        // get random angle 0-360 degrees
        return twister.randomInt(0, 36) * 10;
    }

    function randomBoolean() {
        // return true or false
        return twister.randomInt(0, 1) === 0;
    }

    function randomSymbol() {
        // return random symbol
        return twister.randomWord(['☼', '☽', '☾', '☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆', '♇', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']);
    }

    function render() {
        // use twister to generate random patterns
        var i, l = twister.randomInt(3, 20), fun, n, s;
        for (i = 0; i < l; i++) {
            fun = twister.randomWord(['circle', 'circle', 'circle', 'triangle', 'rotatedTriangle', 'line', 'clock', 'nside', 'offCenter', 'around', 'symbol', 'symbolAround']);
            //console.log(fun);
            switch (fun) {
            case 'circle':
                circle(cx, cy, randomDistance(), l < 10 ? randomBoolean() : false);
                break;
            case 'triangle':
                triangle(cx, cy, randomDistance());
                break;
            case 'rotatedTriangle':
                triangle(cx, cy, randomDistance(), randomRotation90);
                break;
            case 'line':
                lineClock(cx, cy, randomAngle(), randomDistance(), randomDistance());
                break;
            case 'clock':
                clock(cx, cy, twister.randomInt(0, 24), randomDistance(), randomDistance());
                break;
            case 'nside':
                n = twister.randomInt(4, 8);
                nside(cx, cy, n, randomDistance(), twister.randomWord([0, 45, 90]), randomBoolean());
                break;
            case 'symbol':
                n = randomDistance();
                circle(cx, cy, n, true);
                symbol(cx, cy, randomSymbol());
                break;
            case 'symbolAround':
                n = twister.randomInt(1, 4) / 10;
                s = randomSymbol();
                around(randomDistance() * (1 - n), twister.randomInt(2, 8), twister.randomWord([0, 45, 90]), function () {
                    circle(cx, cy, 0.15 * d, true);
                    symbol(cx, cy, s);
                });
                break;
            case 'offCenter':
                context.save();
                offCenter(randomAngle(), randomDistance() * 0.8);
                triangle(cx, cy, randomDistance() * 0.5, randomRotation90);
                context.restore();
                break;
            case 'around':
                n = twister.randomInt(1, 4) / 10;
                around(randomDistance() * (1 - n), twister.randomInt(2, 8), twister.randomWord([0, 45, 90]), function (aa) {
                    nside(cx, cy, 3, n * d, aa, false);
                });
                break;
            }
        }
    }
    render();
};

