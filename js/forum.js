// Simple discussion forum (on the wall of town hall)
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.forumRecent = null;

SC.forum = function (aPage) {
    SC.cmd.run('#caption Nothing new');
};

SC.commands["#forum"] = {
    "summary": "Show discussion forum",
    "synopsis": ["#forum PAGE"],
    "example": ["#forum 0", "#forum 5"],
    "callback": function (aParams) {
        var page = parseInt(SC.cmd.first(aParams) || '0', 10);
        console.log('#forum ', page);
        SC.forum(page);
    }
};

