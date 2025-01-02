// Ghost module for Node.js, contains algorithm, all characters and slang

// code
var GHOST = require('./ghost.js');

// characters
GHOST.character = {};
GHOST.character.basic = require('./character/basic.js');
GHOST.character.ghost = require('./character/ghost.js');
GHOST.character.ga = require('./character/ga.js');
GHOST.character.android = require('./character/android.js');

// slang and shortcut
var ss = require('./character/slang.js');
GHOST.slang = ss.slang;
GHOST.shortcuts = ss.shortcuts;

// return it as 1 object
module.exports = GHOST;
