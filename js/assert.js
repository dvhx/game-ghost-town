// Better assert function (because console . assert does not stop execution)
// require: none
"use strict";

var SC = window.SC || {}

SC.assert = function (aTrue, aMessage) {
    // throw exception if aTrue is not true
    if (typeof aTrue === 'boolean') {
        if (aTrue !== true) {
            console.error("Assertion failed: " + aMessage);
            throw "Assertion failed: " + aMessage;
        }
    } else {
        if (!aTrue) {
            console.error("Assertion failed: " + aMessage);
            throw "Assertion failed: " + aMessage;
        }
    }
};

