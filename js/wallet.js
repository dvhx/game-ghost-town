// Gold Wallet - gold is created by asking new questions
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {}

SC.wallet = (function () {
    // gold wallet implementation
    var self = {};
    self.gold = 0;
    self.bank = 0;
    self.silver = [];
    self.lastConvertDate = null;
    self.progress = {};

    self.show = function () {
        // show how much gold player have
        SC.blink.show(self.gold + ' gold, ' + self.silver.length + ' silver');
    };

    self.save = function () {
        // save wallet to persistent storage
        SC.storage.writeObject('SC.wallet', self);
    };

    self.load = function () {
        // load wallet from persistent storage
        var w = SC.storage.readObject('SC.wallet', {});
        if (w && (typeof w.online === 'boolean')) {
            self.online = w.online;
        } else {
            console.log('SC.wallet.load - wallet online by default');
            self.online = true;
        }
        self.gold = (w && w.gold) || 0;
        self.bank = (w && w.bank) || 0;
        self.importedGold = (w && w.importedGold) || {};
        self.silver = (w && w.silver) || [];
        self.progress = (w && w.progress) || {};

        // restore purged silver
        if (SC.storage.keyExists('SC.purgedSilver')) {
            self.silver = SC.storage.readObject('SC.purgedSilver');
            self.save();
            SC.storage.erase('SC.purgedSilver');
        }

        self.lastConvertDate = (w && w.lastConvertDate) || null;
    };
    self.load();

    self.addQuestion = function (aQuestion, aAnswer, aNpc) {
        // one question = one gold
        self.gold++;
        self.save();
    };

    self.export = function () {
        // export wallet for offline use
        SC.export(JSON.stringify(self, undefined, 4), 'ghosttown-wallet', '.json', SC.cmd.show);
    };

    self.importGold = function (aGold, aGoldHash) {
        // import gold from offline transaction
        alert('Importing gold is no longer needed');
        return 1;
    };

    self.bankAvailable = function (aBubble) {
        // return true if player is nearby banker
        if (SC.npcs.findNearestType('banker', 3)) {
            return true;
        }
        if (aBubble) {
            SC.player.bubble('No nearby banker found!');
        }
        return false;
    };

    self.bankDeposit = function (aGold) {
        // deposit gold to bank
        SC.type.isInteger(aGold, 'aGold');
        if (!self.bankAvailable(true)) {
            return 0;
        }
        aGold = Math.min(Math.abs(aGold), self.gold);
        self.bank += aGold;
        self.gold -= aGold;
        self.save();
        console.log('deposited', aGold, 'gold, gold=', self.gold, ' bank=', self.bank);
        return aGold;
    };

    self.bankWithdraw = function (aGold) {
        // withdraw gold from bank
        SC.type.isInteger(aGold, 'aGold');
        if (!self.bankAvailable(true)) {
            return 0;
        }
        aGold = Math.min(Math.abs(aGold), self.bank);
        self.bank -= aGold;
        self.gold += aGold;
        self.save();
        console.log('withdrawn', aGold, 'gold, gold=', self.gold, ' bank=', self.bank);
        return aGold;
    };

    self.compact = function () {
        // return wallet in more compact form, used for bug reports
        return JSON.stringify(self);
    };

    self.progressStart = function (aQuest) {
        // mark quest as started
        console.log('SC.wallet.progressStart', aQuest);
        if (!self.progress.hasOwnProperty(aQuest)) {
            self.progress[aQuest] = {};
        }
        // only if started for first time
        if (!self.progress[aQuest].hasOwnProperty('start')) {
            self.progress[aQuest].start = new Date();
            self.save();
        }
    };
    self.progressStart('library');

    self.progressFinish = function (aQuest) {
        // mark quest as finished
        console.log('SC.wallet.progressFinish', aQuest);
        if (!self.progress.hasOwnProperty(aQuest)) {
            self.progress[aQuest] = {};
        }

        // only if finished for first time
        if (!self.progress[aQuest].hasOwnProperty('finish')) {
            self.progress[aQuest].finish = new Date();
            self.save();
            var level = ['herb', 'frog', 'rocks', 'crystals', 'emerald_ring', 'fishing', 'firetruck', 'jail', 'tomb', 'library', 'library_treasure'].indexOf(aQuest) + 1;
            //self.progressReport(aQuest);
        }
    };

    self.progressReport = function () {
        console.log('progressReport deprecated');
    };

    return self;
}());

SC.init.done('SC.wallet');

