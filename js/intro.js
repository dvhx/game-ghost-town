// Game intro - currently as newspaper article
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {}
SC.commands = SC.commands || {};
SC.currentIntro = null;

SC.commands["#intro"] = {
    "summary": "Show introduction to game controls",
    "synopsis": [
        "#intro - show intro",
        "#intro on - enable showing intro on game start",
        "#intro off - this will disable showing intro on game start"
    ],
    "example": ["#intro off"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams, ['on', 'off']), aa, n;
        // disable intro
        if (a === 'off') {
            SC.storage.writeBoolean('SC.intro.enabled', false);
            //SC.player.bubble("Intro will no longer show on game start");
            SC.cmd.run(aParams);
            return;
        }
        // enable intro
        if (a === 'on') {
            SC.storage.writeBoolean('SC.intro.enabled', true);
            SC.player.bubble("Intro will show on each game start");
            SC.cmd.run(aParams);
            return;
        }
        // show intro
        aa = SC.articles();
        aa.header('Controls & Instructions');
        aa.title('Welcome');
        aa.text('Ghosttown is a town populated entirely by chat bots. Each with different personality. They live and work in various places within town. You can walk around and talk to them. There are 10 quests you must solve.'); //There are also some quests where you can do more complex stuff. If you want to close this intro, click on the "X". on the upper right corner of the screen.');
        aa.title('Moving around');
        if (Android.isReal()) {
            aa.text('Use blue on-screen arrows to move your character around. When you step onto stairs you will be automatically transferred to place where these stairs lead.');
        } else {
            aa.text('Use keyboard arrows move your character around. When you step onto stairs you will be automatically transferred to place where these stairs lead. In the upper right corner is inventory and green arrow will pick up items from the ground.');
        }
        aa.title('Talking');
        if (Android.isReal()) {
            aa.text("Tap on white input text on the bottom of the screen to display on-screen keyboard. Type text you want to say and press green circled arrow on keyboard.");
        } else {
            aa.text("Press Enter to talk to nearby character. Press Esc to walk.");
        }
        aa.title('Picking items');
        aa.text("Some objects can be picked up from the ground. Use green upward arrow in the upper right corner to pick up items you are standing on.");
        //aa.title('Special commands');
        //aa.text("Text that start with # is interpreted as special command. Type #help to display list of special commands. Type #intro to show this introductionary information.");
        //aa.title('Silver & gold');
        //aa.text("Every time you talk you receive small amount of silver (when you are offline) or gold (when you are online). You can use gold to buy stuff in shop. You can find more info about this in the bank.");
        //aa.title("How to skip this intro");
        //aa.text("If you already understood the basic concepts of this game, you can hide this intro by issuing \"#intro off\" command. Or simply press this button:");
        //aa.button("Hide introduction permanently", function () {
        //    SC.cmd.run('#intro off');
        //    n.close();
        //}).style.float = 'none';
        //aa.text("If you want to see it later, simply use \"#intro\" command again.").style.marginTop = '1ex';
        aa.title('Choose your character');
        aa.character('boy');
        aa.character('girl');
        aa.text("Tap on the character you want to play with.");
        SC.cmd.run('#intro off');
        // NOTE: android webview refuses to load iframe without user interraction, so it cannot be displayed on startup! using newspaperFromUrl
        n = SC.newspaperFromData('Ghosttown', aa.main);
        SC.currentIntro = n;
        SC.cmd.run(aParams);
    }
};

