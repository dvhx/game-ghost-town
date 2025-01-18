// Built-in release scripts, unit tests and application tests
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.releaseQuests = function () {
    // walkthrought for all quest for faster testing of all quests
    var btn,
        index = 0,
        steps = [
            // herbs
            '#goto 55 60 #caption "Move up"',
            '___ What do you need?',
            '___ What herb?',
            '___ Where can I find them?',
            '___ Where is quarry?',
            '___ How much do you need?',
            '#goto 50 72 #caption "Walk through mine!"',
            '#goto 52 80 #caption "Pick 3 herbs!"',
            '#goto 51 82 #caption "Walk back through mine!"',
            '#goto 55 60 #caption "Move up, get rope"',
            '#inventory',
            // frog
            '#goto frog',
            '___ how can I help you',
            '#caption "Move right, use rope"',
            '#inventory',
            // getting info about emerald ring
            '#goto 45 63',
            '___ what do you need',
            'I have ring',
            // minerals
            '#goto landoffice #caption "Move up 2x"',
            '___ What do you need?',
            '___ Where can I find rocks?',
            '___ How much do you need?',
            '#goto 36 57 #caption "Move right, search rocks"',
            '#goto 33 44 #caption "Move right, search rocks"',
            '#goto 48 71 #caption "Move right, search rocks"',
            '#goto 4 3 quarry #caption "Move left, search rocks"',
            '#goto 6 4 quarry #caption "Move right, search rocks"',
            '#goto landoffice #caption "Move up 2x, give rocks"',
            '#inventory',
            // crystals
            '___ Where are crystals?',
            '#goto 11 4 quarry #caption "Move right, use pickaxe"',
            '#goto 55 60 ghosttown #caption "Move to basement"',
            '#goto 26 12 basement_ken #caption "Move left, use pickaxe"',
            '#goto 24 3 basement_ken #caption "Move up, use pickaxe"',
            '#goto 21 17 basement_ken #caption "Move upstairs"',
            '#goto landoffice #caption "Move up 2x, give crystals"',
            // jane's ring
            '#goto 46 64 ghosttown #caption "Move left, give emerald ring"',
            // talk with firefighter
            '#goto 12 3 ghosttown',
            '___ Can you give me ladder',
            '___ Do you have ladder?',
            '___ How can I help you?',
            // fishing
            '#goto 72 62 ghosttown',
            '___ What do you need?',
            '___ Do you need my help?',
            '___ How can i catch fish?',
            '___ Where can i get fishing rod?',
            '#goto 68 67 ghosttown #caption "Move left, try fishing"',
            '#goto 65 62 ghosttown #caption "Move left, try fishing"',
            '#goto 65 53 ghosttown #caption "Move left, try fishing"',
            '#goto 65 51 ghosttown #caption "Move left, try fishing"',
            '#goto 71 62 ghosttown #caption "Move right, give 3 fish"',
            '#inventory',
            // firetruck
            '#goto 12 3 ghosttown #caption "Move right, give info"',
            '#inventory',
            // prison break
            '#goto 3 5 basement_ken #caption "Move up, use pickaxe"',
            '#caption "Move down the hole',
            '#caption "Move back up',
            // skeleton
            '#goto tomb',
            '___ How can i help you?',
            '___ Where is your grave?',
            '___ How can i get in to the tomb?',
            '#caption "Try going into the tomb"',
            '___ Who are you?',
            '___ Can you help me find skeleton\'s grave?',
            '#caption "Move down"',
            '#goto 8 54 ghosttown #caption "Move left, give watches, go in"',
            '#caption "move down and back in"',
            // library
            '#goto 2 1 basement_town_hall #caption "Move left then up, use key"',
            '#caption "Move up, down, up"',
            '#goto 3 2 library #caption "Move right, look down"',
            // library
            '#caption "THE END"',
            function () {
                document.body.removeChild(btn);
            }
        ];

    function next() {
        // move to next step
        var s = steps[index];
        if (typeof s === 'function') {
            s();
        } else {
            SC.cmd.run(s);
        }
        index++;
        btn.textContent = 'Next ' + index + '/' + steps.length + ' - ' + steps[index];
        SC.cmd.show();
    }

    // button
    btn = document.createElement('button');
    btn.style.position = 'fixed';
    btn.style.left = '0cm';
    btn.style.bottom = '4cm';
    btn.style.minWidth = '1cm';
    btn.style.minHeight = '1cm';
    btn.textContent = 'Next';
    btn.addEventListener('click', next);
    document.body.appendChild(btn);
};

SC.releaseNewspaper = function () {
    // test all newspaper
    SC.cmd.run([
        "#button Next newspaper #bank",
        "#button Next newspaper #debug history",
        "#button Next newspaper #debug storage",
        "#button Next newspaper #help",
        "#button Next newspaper #help more",
        "#button Next newspaper #history",
        "#button Next newspaper #characters",
        "#button Next newspaper #intro",
        "#button Next newspaper #inventory",
        "#button Next newspaper #places",
        "#button Next newspaper #tiles",
        "#button Next newspaper #touch log",
        "#button Next newspaper #wallet silver",
        "#button Next newspaper #goto shop #move up #move up #move up #shop",
        "#reread",
        "#button Next newspaper #forum"
    ].join(' '));
};

SC.commands["#release"] = {
    "summary": "Built-in release scripts, unit tests and application tests",
    "hidden": true,
    "synopsis": [
        "#release quests - test all quests",
        "#release newspaper - test all features using newspaper"
    ],
    "callback": function (aParams) {
        var first = SC.cmd.first(aParams, ['quests', 'newspaper']);
        switch (first) {
        case "quests":
            SC.releaseQuests();
            break;
        case "newspaper":
            SC.releaseNewspaper();
            break;
        }
        SC.cmd.finalize();
    }
};

