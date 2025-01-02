// Toolbar with permanently visible tool buttons (inventory, pick)
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator, clearTimeout

var SC = window.SC || {}

SC.toolbar = (function () {
    var self = {}, repeat_command, hider;

    document.getElementById('tool_inventory').addEventListener('click', function (event) {
        event.preventDefault();
        SC.cmd.show();
        SC.cmd.run('#inventory');
    }, true);

    document.getElementById('tool_pick').addEventListener('click', function (event) {
        event.preventDefault();
        if (SC.touch.enabled) {
            SC.cmd.show();
        }
        SC.cmd.run('#inventory pick');
    }, true);

    document.getElementById('tool_repeat').addEventListener('click', function (event) {
        // click on repeat button will repeat recent repeatable command
        event.preventDefault();
        SC.cmd.show();
        SC.cmd.run(repeat_command);
        self.repeatable(repeat_command);
    }, true);

    function hide() {
        // hide repeat command
        document.getElementById('tool_repeat').style.display = 'none';
        hider = null;
    }
    hide();

    self.repeatable = function (aCommand) {
        // temporarily add command to repeatable commands
        // clear previous hide timer
        if (hider) {
            clearTimeout(hider);
        }
        // show repeat button
        repeat_command = aCommand;
        document.getElementById('tool_repeat').style.display = 'block';
        // hide repeat command after some time
        hider = setTimeout(hide, 30000);
    };

    return self;
}());
