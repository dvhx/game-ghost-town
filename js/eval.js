// Eval command (only for development, later it will be removed)
"use strict";
// globals: 

var SC = window.SC || {};

SC.commands['#eval'] = {};
SC.commands['#eval'].summary = "Evaluate JavaScript expression, for debugging purposes only";
SC.commands['#eval'].hidden = true;
SC.commands['#eval'].synopsis = ["#eval CODE"];
SC.commands['#eval'].example = ["#eval SC.storage.writeString('SC.rc','#hk')"];
SC.commands['#eval'].callback = function (aParams) {
    console.log('eval', aParams.join(' '));
    var r = eval(aParams.join(' '));
    if (r) {
        SC.alert(r.toString(), undefined, undefined, SC.cmd.show);
    }
};


