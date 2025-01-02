// Ghost character
"use strict";

var GHOST = GHOST || {};
GHOST.character = GHOST.character || {};
GHOST.character.surveyor_buy_land = {
    "id": "surveyor_buy_land",
    "params": {
        "$nick;": "Sue",
        "$age;": "22",
        "$borndate;": "1994-10-03",
        "$location;": "Ghosttown",
        "$city;": "Ghosttown",
        "$sex;": "woman"
    },
    "parents": [
        "core",
        "villager"
    ],
    "data": {
        "what is this building ?": [
            "This is land office, I keep track of who owns which parcell"
        ],
        "what do you survey ?": [
            "I survey the land and keep track who owns which land"
        ],
        "what can i do here ?": [
            "You can find who owns which land here"
        ],
        "what do you do here ?": [
            "I catalogize land ownership here"
        ],
        "i want to buy land": [
            "If you want to buy land, use \".buy land\" while standing on the spot you want to buy"
        ],
        "how much does land cost ?": [
            "Land near town center is more expensive than further away, use \".inspect\" command to see land price"
        ],
        "tell me again how to buy land": [
            "Use \".buy land\" while standing on the spot you want to buy"
        ]
    },
    "index": {},
    "indexed": 0
};