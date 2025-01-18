// Keyboard events
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.keyboard = {};
SC.keyboard.code = {};
SC.keyboard.key = {};

SC.keyboard.onKeyDown = function (event) {
    // press key
    if (SC.inInput) {
        return;
    }
    // remember state of keys
    SC.keyboard.code[event.keyCode] = true;
    SC.keyboard.key[event.key] = true;
    // make sure player reacts right away
    if (!event.repeat) {
        SC.player.keyChange(event.key, true);
    }
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        event.preventDefault();
    }
};

SC.keyboard.onKeyUp = function (event) {
    // release key
    if (SC.inInput) {
        return;
    }
    // remember state of keys
    SC.keyboard.code[event.keyCode] = false;
    SC.keyboard.key[event.key] = false;
    // stop player's walk animation
    SC.player.keyChange(event.key, false);
};

SC.keyboard.clear = function () {
    // forget what is pressed, usefull for stopping player after stairs
    console.info('SC.keyboard.clear');
    SC.keyboard.code = {};
    SC.keyboard.key = {};
};

window.addEventListener('keydown', SC.keyboard.onKeyDown, true);
window.addEventListener('keyup', SC.keyboard.onKeyUp, true);

