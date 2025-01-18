// Transactions (simple mechanism to continue quests interrupted by #reload in the middle)
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.transaction = (function () {
    var self = {};
    self.pending = {};

    self.load = function () {
        // load pending transactions from local storage
        self.pending = SC.storage.readObject('SC.transaction.pending', {});
    };
    self.load();

    self.save = function () {
        // save pending transactions to local storage
        SC.storage.writeObject('SC.transaction.pending', self.pending);
    };

    self.executePending = function () {
        // execute pending transactions
        var c;
        console.info('SC.transaction.executePending', self.pending);
        for (c in self.pending) {
            if (self.pending.hasOwnProperty(c)) {
                if (self.pending[c]) {
                    console.info('SC.transaction.executePending', c);
                    SC.cmd.run(c + ' #transaction finish ( ' + c + ' )');
                }
            }
        }
        self.save();
    };

    self.start = function (aCommand) {
        // start new transactions
        self.pending[aCommand] = true;
        self.save();
    };

    self.finish = function (aCommand) {
        // remove command from pending transactions
        self.pending[aCommand] = false;
        self.save();
    };

    return self;
}());

SC.commands["#transaction"] = {
    "summary": "Transactions must be used in quests where action button awaits user interraction. If some part of the quest is running and user #reload app, the behavior may become undefined, for example in emerald ring quest, the ring combining is button triggered so when user #reload app before ring is combined, it will never be combined again. Transaction simply define what to do when user does not finish current quest.",
    "hidden": true,
    "synopsis": [
        "#transaction start ( COMMAND ) - add COMMAND to the transaction log",
        "#transaction finish ( COMMAND ) - mark COMMAND as successfully completed",
        "#transaction pending - execute pending transactions, this is run automatically on app start"
    ],
    "example": [
        "#quest_rocks_give",
        "#transaction start ( #quest_combine_emerald_ring )",
        "#quest_combine_emerald_ring",
        "#transaction finish ( #quest_combine_emerald_ring )"
    ],
    "callback": function (aParams) {
        var f = SC.cmd.first(aParams, ['start', 'finish', 'pending']),
            q = SC.cmd.first(aParams);
        console.log('#transaction', f, q, 'cmd=', aParams);
        if ((f === 'start') && (q !== '')) {
            SC.transaction.start(q);
        }
        if ((f === 'finish') && (q !== '')) {
            SC.transaction.finish(q);
        }
        if (f === 'pending') {
            SC.transaction.executePending();
        }
        SC.cmd.run(aParams);
    }
};

