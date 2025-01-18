// Description and properties of goods and items sold in stores
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.goods = {
    "apple": {
        "title": "Apple",
        "description": "Delicious green juicy fresh organic apple.",
        "edible": true,
        "drop": true,
        "price": 1
    },
    "flag": {
        "title": "Flag",
        "description": "Nice flag on a pole",        //"Land ownership flag, use this flag and \"#buy land\" command to buy the land on which you are standing. Only grassy areas can be bought.",
        "edible": false,
        "drop": true,
        "price": 10
    },
    "phone": {
        "title": "Phone",
        "description": "Mobile phone, good for texting, good batery life.",
        "edible": false,
        "drop": true,
        "price": 15
    },
    "table": {
        "title": "Table",
        "description": "Dining table for 4 people, solid oak, natural finish.",
        "edible": false,
        "drop": true,
        "price": 7
    },
    "cabinet": {
        "title": "Cabinet",
        "description": "Storage cabinet with 2 cases, no locks, solid oak, natural finish.",
        "edible": false,
        "drop": true,
        "price": 8
    },
    "bedtop": {
        "title": "Bed pillow",
        "description": "Bed pillow",
        "edible": false,
        "drop": true,
        "price": 5
    },
    "bedbottom": {
        "title": "Bed",
        "description": "Comfortable bed, straw matress, solid oak",
        "edible": false,
        "drop": true,
        "price": 5
    },
    "throne": {
        "title": "Throne",
        "description": "Solid brass throne, mirror finish",
        "edible": false,
        "drop": true,
        "price": 50
    },
    "tree1": {
        "title": "Decidious tree",
        "description": "Decidious tree, can be planted on grassy areas, grows very fast.",
        "edible": false,
        "drop": true,
        "price": 5
    },
    "tree2": {
        "title": "Evergreen tree",
        "description": "Evergreen tree, can be planted on grassy areas, grows very fast.",
        "edible": false,
        "drop": true,
        "price": 10
    },
    "torchyellow1": {
        "title": "Yellow torch",
        "description": "Perfect to light any dark corner, last very long. Matches not included.",
        "edible": false,
        "drop": true,
        "price": 15
    },
    "herb": {
        "title": "Medicinal herb",
        "description": "Rare medicinal herb, cures everything.",
        "edible": false,
        "drop": true,
        "price": 50
    },
    "herb-ground": {
        "title": "Medicinal herb",
        "description": "Rare medicinal herb, cures everything.",
        "edible": false,
        "drop": true,
        "price": 50
    },
    "rope": {
        "title": "Rope",
        "description": "Few meters of strong hemp rope.",
        "edible": false,
        "drop": true,
        "price": 150
    },
    "ring": {
        "title": "Golden ring",
        "description": "Simple golden ring without gem stone",
        "edible": false,
        "drop": true,
        "price": 1000
    },
    "emerald_ring": {
        "title": "Emerald ring",
        "description": "Golden ring with emerald gem stone",
        "edible": false,
        "drop": true,
        "price": 1500
    },
    "key": {
        "title": "Golden key",
        "description": "Old golden key",
        "edible": false,
        "drop": true,
        "price": 2000
    },
    "ladder": {
        "title": "Ladder",
        "description": "Six foot wooden ladder",
        "edible": false,
        "drop": true,
        "price": 300
    },
    "watches": {
        "title": "Watches",
        "description": "Broken old golden pocket watches of Ghosttown founder, time stopped at 8:25pm",
        "edible": false,
        "drop": true,
        "price": 5000
    },
    "rocks": {
        "title": "Rocks",
        "description": "Various interestingly looking rocks, some of them may be quite rare",
        "edible": false,
        "drop": true,
        "price": 10
    },
    "crystals": {
        "title": "Crystals",
        "description": "Various shiny crystals, some of them may be rare gemstones",
        "edible": false,
        "drop": true,
        "price": 4000
    },
    "emerald": {
        "title": "Emerald",
        "description": "Brilliant green emerald, perfectly fits golden ring",
        "edible": false,
        "drop": true,
        "price": 1500
    },
    "tag:basement": {
        "title": "tag:basement",
        "description": "This tag indicates that Ken allows player in the basement",
        "edible": false,
        "tile": "info",
        "drop": false,
        "inventory": false,
        "price": 0
    },
    "tag:rocks": {
        "title": "tag:rocks",
        "description": "This tag indicates that you started rocks quest",
        "edible": false,
        "tile": "info",
        "drop": false,
        "inventory": false,
        "price": 0
    },
    "tag:founder": {
        "title": "tag:founder",
        "description": "This tag indicates that you spoke with ghost and know how to bring back skeleton",
        "edible": false,
        "tile": "info",
        "drop": false,
        "inventory": false,
        "price": 0
    },
    "tag:skeleton": {
        "title": "tag:skeleton",
        "description": "This tag indicates that you gave watches to skeleton and he entered the tomb",
        "edible": false,
        "tile": "info",
        "inventory": false,
        "drop": false,
        "price": 0
    },
    "tag:firetruck": {
        "title": "Info about fire truck",
        "description": "This tag indicates that fisherman told player about firetruck in lake",
        "edible": false,
        "tile": "info",
        "inventory": false,
        "drop": false,
        "price": 0
    },
    "tag:watches": {
        "title": "Receive watches from Peter",
        "description": "This tag indicate that player received watches from prisoner Peter by releasing him",
        "edible": false,
        "tile": "info",
        "inventory": false,
        "drop": false,
        "price": 0
    },
    "worms": {
        "title": "Earthworms",
        "description": "Earthworms, very good fishing bait",
        "edible": false,
        "drop": true,
        "price": 100
    },
    "fishing_rod": {
        "title": "Fishing rod",
        "description": "Complete fishing rod with reel, fishing line, floater and hook",
        "edible": false,
        "drop": true,
        "price": 120
    },
    "fish": {
        "title": "Fish",
        "description": "Small freshwater coarse fish",
        "edible": false,
        "drop": true,
        "price": 30
    },
    "pickaxe": {
        "title": "Pickaxe",
        "description": "Rusty old pickaxe, good for digging and mining",
        "edible": false,
        "drop": true,
        "price": 1000
    }
};

SC.goodsAdd = function (aName, aTitle, aDescription, aEdible, aDrop, aPrice) {
    // add single goods to goods
    if (SC.goods.hasOwnProperty(aName)) {
        console.error('Adding already defined goods', aName);
        return;
    }
    SC.goods[aName] = {
        "title": aTitle,
        "description": aDescription || aTitle,
        "edible": aEdible,
        "drop": aDrop,
        "price": aPrice
    };
};

