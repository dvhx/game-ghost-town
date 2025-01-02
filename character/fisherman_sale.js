// Ghost character
"use strict";

var GHOST = GHOST || {};
GHOST.character = GHOST.character || {};
GHOST.character.fisherman_sale = {
    "id": "fisherman_sale",
    "params": {
        "$nick;": "Fred",
        "$age;": "33",
        "$borndate;": "1982-07-11",
        "$location;": "Ghosttown",
        "$city;": "Ghosttown",
        "$sex;": "man"
    },
    "parents": [
        "core",
        "villager"
    ],
    "data": {
        "can you sell me stuff ?": [
            "Maybe I can sell you some fish"
        ],
        "can you sell me some stuff ?": [
            "I can sell you some fish"
        ],
        "what do you have ?": [
            "I have small and big fish"
        ],
        "i have money": [
            "What kind of fish do you want?"
        ],
        "what do you have in stock ?": [
            "I have carps and catfish"
        ],
        "you don't want my money ?": [
            "Sure I do, just tell me what do you want to buy"
        ],
        "can you sell me some fish ?": [
            "Sure, type #buy carp or #buy catfish"
        ],
        "how much is the fish ?": [
            "Carp cost $10, catfish cost $15"
        ],
        "what can i do here ?": [
            "You can buy fish here"
        ],
        "what do you do here ?": [
            "I catch and sell fish here"
        ],
        "can i fish there": [
            "You can fish if you buy fishing licence",
            "You need fishing licence for fishing"
        ]
    },
    "index": {},
    "indexed": 0
};