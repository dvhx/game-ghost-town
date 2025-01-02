// Destop modifications
"use strict";
// globals: document, window

var SC = window.SC || {}

window.addEventListener('DOMContentLoaded', function () {
    // disable touchpad
    SC.init.await('SC.window', function () {
        SC.touch.enabled = false;
    });
    // remove click listener that displays console on mobile
    SC.init.await('SC.touchClickSet', function () {
        document.getElementById('canvas_bubbles').removeEventListener('click', SC.cmd.show, true);
    });
});
