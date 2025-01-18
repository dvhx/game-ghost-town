// Runtime type checking (mostly used during refactoring)
// require: none
"use strict";

var SC = window.SC || {};

SC.type = {};

SC.type.is = function (aVariable, aName, aType) {
    // pass if aVariable is of given type
    var a = typeof aVariable, s;
    if (a !== aType) {
        s = "Variable " + aName + " is not " + aType + " but " + (typeof aVariable) + "!";
        console.error(s);
        throw s;
    }
};

SC.type.isNumber = function (aVariable, aName) {
    // pass if aVariable is number
    var s;
    SC.type.is(aVariable, aName, 'number');
    if (isNaN(aVariable)) {
        s = "Variable " + aName + " is not a number (NaN)!";
        console.error(s);
        throw s;
    }
};

SC.type.isInteger = function (aVariable, aName) {
    // pass if aVariable is integer
    var s;
    SC.type.isNumber(aVariable, aName);
    if (aVariable % 1 !== 0) {
        s = "Variable " + aName + " is not integer!";
        console.error(s);
        throw s;
    }
};

SC.type.inRange = function (aVariable, aName, aMin, aMax) {
    // pass if aVariable is number in given min-max range
    var s;
    SC.type.is(aVariable, aName, 'number');
    if ((aVariable < aMin) || (aVariable > aMax)) {
        s = "Variable " + aName + " has value " + aVariable + " out of range <" + aMin + ", " + aMax + ">";
        console.error(s);
        throw s;
    }
};

SC.type.isBoolean = function (aVariable, aName) {
    // pass if aVariable is boolean
    SC.type.is(aVariable, aName, 'boolean');
};

SC.type.isString = function (aVariable, aName) {
    // pass if aVariable is string
    SC.type.is(aVariable, aName, 'string');
};

SC.type.isObject = function (aVariable, aName) {
    // pass if aVariable is object
    SC.type.is(aVariable, aName, 'object');
};

SC.type.isFunction = function (aVariable, aName) {
    // pass if aVariable is function
    SC.type.is(aVariable, aName, 'function');
};

SC.type.isArray = function (aVariable, aName) {
    // pass if aVariable is array
    var s;
    if (!aVariable) {
        s = "Undefined variable " + aName + ", expected array!";
        console.error(s);
        throw s;
    }
    if (!Array.isArray(aVariable)) {
        s = "Variable " + aName + " is not array but " + typeof aVariable + "!";
        console.error(s);
        throw s;
    }
};

SC.type.isArrayOf = function (aVariable, aName, aType) {
    // pass if aVariable is array of type
    var i, a, s;
    SC.type.isArray(aVariable, aName);
    for (i = 0; i < aVariable.length; i++) {
        a = typeof aVariable[i];
        if (a !== aType) {
            s = "Variable " + aName + "[" + i + "] is not " + aType + "!";
            console.error(s);
            throw s;
        }
    }
};

SC.type.isArrayOfNumber = function (aVariable, aName) {
    // pass if aVariable is array of numbers
    SC.type.isArrayOf(aVariable, aName, 'number');
};

SC.type.isArrayOfBoolean = function (aVariable, aName) {
    // pass if aVariable is array of booleans
    SC.type.isArrayOf(aVariable, aName, 'boolean');
};

SC.type.isArrayOfString = function (aVariable, aName) {
    // pass if aVariable is array of strings
    SC.type.isArrayOf(aVariable, aName, 'string');
};

SC.type.isArrayOfObject = function (aVariable, aName) {
    // pass if aVariable is array of objects
    SC.type.isArrayOf(aVariable, aName, 'object');
};

SC.type.isArrayOfFunction = function (aVariable, aName) {
    // pass if aVariable is array of functions
    SC.type.isArrayOf(aVariable, aName, 'function');
};

SC.type.unused = function () {
    // this does nothing but hides JSLint warning
    return;
};

