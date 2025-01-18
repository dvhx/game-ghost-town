// Console for text input and commands
"use strict";
// globals: document, window, setTimeout, setInterval

var SC = window.SC || {};
var z;
SC.commands = SC.commands || {};

SC.cmd = (function () {
    // Object for controling command console
    var self = {};
    self.enabled = true;
    self.input = null;
    self.shortcuts = {};
    self.history = [];
    self.historyIndex = 0;

    self.loadHistory = function () {
        // restore command history
        self.history = SC.storage.readArray('SC.cmd.history');
        self.historyIndex = self.history.length;
    };

    self.error = function (aMessage, aAdd) {
        // show error in input field itself
        self.input.value = aAdd ? self.input.value + aMessage : aMessage;
        setTimeout(self.show, 200); // Focusing input to keep keyboard visible
    };

    self.parse = function (aCommands) {
        // split command such that string in quotes enclose single string even with spaces
        // example: foo "hello world" bar "another sentence" end --> ["foo", "hello world", "bar", "another sentence", "end"]
        var a = aCommands.split(' '), i, r = [], buf = [], q = false, m;
        for (i = 0; i < a.length; i++) {
            m = a[i].match(/"/g); // "
            if (m && (m.length % 2 === 1)) {
                q = !q;
            }
            if (!q) {
                buf.push(a[i]);
                r.push(buf.join(' '));
                buf = [];
            } else {
                buf.push(a[i]);
            }
        }
        // remove enclosing quotes - we cannot do that because nested events would run strings without quotes!
        //for (i = 0; i < r.length; i++) {
        //    r[i] = r[i].replace(/(^"|"$)/g, '');
        //}
        return r;
    };

    self.run = function (aCommands) {
        // run multiple commands
        var par = aCommands, first, a;

        if (typeof par === 'string') {
            // remove EOL
            par = par.replace(/\n/g, ' ').trim();
            // remove \0 (copy/paste artifact from lazarus)
            par = par.replace(/\0/g, ' ').trim();
            // parse command
            par = self.parse(par);
        } else {
            if (par && (par.length > 0)) {
                par[0] = par[0].replace(/^\.[\ ]{0,1}/, '#').trim();
            }
        }

        // ignore empty command
        if (!par || (par.length <= 0) || (aCommands === '')) {
            return;
        }

        // first parameter is command
        first = par.splice(0, 1)[0];
        if (first.charAt(0) === '/') {
            console.warn('/commands are deprecated, use #commands');
        }
        //console.info('SC.cmd.run', par, 'first', first);

        // call command with parameters
        if (SC.commands.hasOwnProperty(first)) {
            if (typeof SC.commands[first].callback === 'function') {
                SC.commands[first].callback(par);
            } else {
                //console.log(SC.commands[first].commands);
                SC.cmd.run(SC.commands[first].commands.join(' ').trim() + ' ' + par.join(' '));
            }
        } else {
            // invalid command
            if (first.charAt(0) === '#') {
                console.warn('No such command "' + first + '", it looks like typo!');
                return;
            }

            // ask question
            if (typeof aCommands === 'object') {
                aCommands = aCommands.join(' ');
            }
            if (aCommands) {
                a = SC.npcs.ask(aCommands);
                SC.wallet.addQuestion(aCommands, a.a || a.command, a.character);
                SC.bubbles.add('Player', aCommands, SC.player.x, SC.player.y);
                if (a && a.a) {
                    SC.bubbles.add(a.nick, a.a, a.x, a.y);
                }
            }
        }
    };

    self.finalize = function () {
        // run closures (after command chain ends or when command was interrupted)
        //console.info('SC.cmd.finalize');
        // implicit unlock
        SC.player.lock = false;
        //SC.bubbles.clearForNick('Player');
    };

    self.visible = function () {
        // return true is input is visible
        return self.input.style.display && (self.input.style.display !== 'none');
    };

    function windowOnKeyDown(event) {
        // show input when user press enter
        //console.log('cmd window', event.key, 'keyCode', event.keyCode);
        if (!self.enabled) {
            return;
        }
        //alert(['keyCode', event.keyCode, 'key', event.key, 'keyIdentifier', event.keyIdentifier, 'code', event.code].join(''));
        if (event.key === 'Enter') {
            if (!self.visible()) {
                self.show();
            }
            event.preventDefault();
        }
        // ` repeats last command
        if ((event.keyCode === 192) && (!SC.player.lock)) {
            self.run(self.history.slice(-1)[0]);
            event.preventDefault();
        }
        // shortcuts
        if (self.shortcuts.hasOwnProperty(event.key)) {
            self.run(self.shortcuts[event.key]);
            event.preventDefault();
        } else {
            if (self.shortcuts.hasOwnProperty(event.keyCode)) {
                self.run(self.shortcuts[event.keyCode]);
                event.preventDefault();
            }
        }
    }

    function inputOnKeyDown(event) {
        // special keys in command input
        var s = self.input.value.trim(),
            ek = event.key; // this works on old chrome too
        // enter confirm command, esc cancels it
        if ((ek === 'Enter') || (event.keyCode === 13)) {
            event.preventDefault();
            self.input.value = '';
            //console.info('cmd', s);
            if ((s !== '##') && (s !== '.') && (s !== '..') && (s !== '. .') && (s.trim() !== '')) {
                if (self.history.slice(-1)[0] !== s) {
                    self.history.push(s);
                }
            }
            self.historyIndex = self.history.length;
            SC.storage.writeArray('SC.cmd.history', self.history.slice(-50));
            if (SC.player.lock && s.match('#goto')) {
                console.warn('#goto from console is forbidden during lock');
            } else {
                self.run(s);
            }
            self.hide();
        }
        // Up = previous command in history
        if (ek === 'ArrowUp') {
            self.historyIndex--;
            if (self.historyIndex < 0) {
                self.historyIndex = 0;
            }
            self.input.value = self.history[self.historyIndex] || '';
        }
        // Down = next command in history
        if (ek === 'ArrowDown') {
            self.historyIndex++;
            if (self.historyIndex > self.history.length - 1) {
                self.historyIndex = self.history.length - 1;
            }
            self.input.value = self.history[self.historyIndex] || '';
        }
        // ESC = hide
        if (event.keyCode === 27) {
            self.hide(true);
        }
    }

    self.first = function (aParams, aAllowedValues) {
        // extract first parameter as string
        var s, bracketLevel = 0, i, last;
        if (aAllowedValues) {
            if (aAllowedValues.indexOf(aParams[0]) < 0) {
                return '';
            }
        }
        // do not fetch if it is command (this is useful for variable argument list)
        //console.error(aParams);
        if (!aParams || (aParams.length === 0)) {
            return '';
        }
        if (aParams[0].charAt(0) === '#') {
            return '';
        }
        // if first parameter is opening bracket, find corresponding closing bracket and pass anything in between as single string
        // this is used for declaring nested events
        if (aParams[0] === '(') {
            last = 0;
            for (i = 0; i < aParams.length; i++) {
                //console.info(i, bracketLevel, aParams[i]);
                if (aParams[i] === '(') {
                    bracketLevel++;
                }
                if (aParams[i] === ')') {
                    bracketLevel--;
                    if (bracketLevel === 0) {
                        last = i;
                        break;
                    }
                }
            }
            s = aParams.splice(1, last - 1);
            aParams.splice(0, 2);
            //console.log('first', s, 'params', aParams);
            return s.join(' ');
        }
        // fetch it
        s = aParams.splice(0, 1);
        if (s) {
            return s[0].replace(/(^"|"$)/g, ''); // removing quotes
        }
        return '';
    };

    self.join = function (aParams) {
        // join parameters back together, using quotes for strings with space
        // usually used by terminators like /event ...
        var i, a = [];
        for (i = 0; i < aParams.length; i++) {
            if (aParams[i].match(' ')) {
                a.push('"' + aParams[i] + '"');
            } else {
                a.push(aParams[i]);
            }
        }
        return a.join(' ');
    };

    self.show = function () {
        // show command input
        self.input.style.display = 'initial';
        self.input.focus();
        self.input.select();
        SC.inInput = true;
    };

    self.hide = function () { // aForceHide
        // hide command input
        if (!SC.touch.enabled) { //  || aForceHide
            self.input.style.display = 'none';
            SC.inInput = false;
        }
    };

    self.hideKeyboard = function (aElement) {
        var element = aElement || SC.cmd.input;
        element.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
        element.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
        setTimeout(function () { // Unfocusing input to hide keyboard
            element.blur();  //actually close the keyboard
            // Remove readonly attribute after keyboard is hidden.
            element.removeAttribute('readonly');
            element.removeAttribute('disabled');
        }, 100);
    };

    // initialize
    window.addEventListener('DOMContentLoaded', function () {
        self.input = document.getElementById('cmd');
        self.input.addEventListener('keydown', inputOnKeyDown);
        self.input.addEventListener('blur', self.hide);
    });
    window.addEventListener('keydown', windowOnKeyDown, true);

    return self;
}());


