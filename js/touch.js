// Touch controls for mobile phones
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {}
var SC = window.SC || {}

SC.isTouchDevice = function () {
    // Return true if device has touch screen (to show touchpad)
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

SC.touch = (function () {
    // touch controls
    var self = {};
    self.element = document.getElementById('touch');
    self.threshold = 0.15; // 0 ~ 0.5
    self.enabled = SC.isTouchDevice(); //navigator.maxTouchPoints > 0;
    self.z = null;
    self.log = [];
    self.lx = 0;
    self.ly = 0;
    if (!self.enabled) {
        self.element.style.display = 'none';
    }

    self.turn = function (aKey, aDirection) {
        // turn player
        if (aKey) {
            SC.player.turn(aDirection);
        }
    };

    self.updateKeyboard = function (aDown, aX, aY) {
        self.log.push('updateKeyboard');
        var dx, dy;
        if (aDown) {
            dx = (aX - self.element.clientWidth / 2) / self.element.clientWidth;
            dy = (aY - self.element.clientHeight / 2) / self.element.clientHeight;
        }
        self.lx = dx;
        self.ly = dy;
        SC.keyboard.key.ArrowLeft = aDown && (dx < -self.threshold);
        SC.keyboard.key.ArrowRight = aDown && (dx > self.threshold);
        SC.keyboard.key.ArrowUp = aDown && (dy < -self.threshold);
        SC.keyboard.key.ArrowDown = aDown && (dy > self.threshold);

        if (SC.keyboard.key.ArrowLeft || SC.keyboard.key.ArrowRight || SC.keyboard.key.ArrowUp || SC.keyboard.key.ArrowDown) {
            self.turn(SC.keyboard.key.ArrowLeft, 'left');
            self.turn(SC.keyboard.key.ArrowRight, 'right');
            self.turn(SC.keyboard.key.ArrowUp, 'up');
            self.turn(SC.keyboard.key.ArrowDown, 'down');
            //SC.bubbles.hide('Player');
        }
    };

    // touch events

    self.onTouchStart = function (event) {
        self.log.push('onTouchStart');
        event.preventDefault();
        self.updateKeyboard(true, event.touches[0].clientX - event.target.offsetLeft, event.touches[0].clientY - event.target.offsetTop);
        SC.renderSafe();
    };

    self.onTouchMove = function (event) {
        self.log.push('onTouchMove');
        event.preventDefault();
        self.updateKeyboard(true, event.touches[0].clientX - event.target.offsetLeft, event.touches[0].clientY - event.target.offsetTop);
    };

    self.onTouchEnd = function (event) {
        self.log.push('onTouchEnd');
        event.preventDefault();
        self.updateKeyboard(false);
        SC.renderSafe();
    };

    // mouse fallback (during development only)

    self.onMouseDown = function (event) {
        // start moving
        self.log.push('onMouseDown');
        event.preventDefault();
        self.updateKeyboard(true, event.offsetX, event.offsetY);
    };

    self.onMouseMove = function (event) {
        // change direction
        self.log.push('onMouseMove');
        event.preventDefault();
        if (event.which === 1) {
            self.updateKeyboard(true, event.offsetX, event.offsetY);
        }
    };

    self.onMouseUp = function (event) {
        // stop moving
        self.log.push('onMouseUp');
        event.preventDefault();
        self.updateKeyboard(false);
    };

    // initialize
    window.addEventListener('DOMContentLoaded', function () {
        self.element.addEventListener('mousedown', self.onMouseDown);
        self.element.addEventListener('mousemove', self.onMouseMove);
        self.element.addEventListener('mouseup', self.onMouseUp);
        self.element.addEventListener('touchstart', self.onTouchStart);
        self.element.addEventListener('touchmove', self.onTouchMove);
        self.element.addEventListener('touchend', self.onTouchEnd);
        document.getElementById('canvas_bubbles').addEventListener('click', SC.cmd.show, true);
        SC.init.done('SC.touchClickSet');
    });

    return self;
}());

