// Simple initializer with dependencies
// require: none
"use strict";

var SC = window.SC || {}

SC.init = (function () {
    var self = {}, pending = [], finished = {};

    function update() {
        // check if all dependencies are finished, run the callback if so
        // if at least one dependencies is not finished it is not ready
        var p, d, all, cb;
        for (p = pending.length - 1; p >= 0; p--) {
            all = true;
            if (pending[p]) {
                for (d = 0; d < pending[p].depend.length; d++) {
                    if (!finished.hasOwnProperty(pending[p].depend[d])) {
                        all = false;
                        break;
                    }
                }
            }
            if (all) {
                if (pending[p]) {
                    cb = pending[p].callback;
                }
                pending.splice(p, 1);
                cb();
            }
        }
    }

    self.await = function (aDepend, aCallback) {
        // when dependencies (comma separated names) are initialized, run the callback
        // remember this name's dependencies and callback
        pending.push({
            depend: (aDepend || '').split(','),
            callback: aCallback
        });
        // check if all dependencies are finished, run callback if so
        update();
    };

    self.done = function (aName) {
        // mark one name as finished
        finished[aName] = true;
        // check if other items depends on it
        update();
    };

    return self;
}());
