// ghosttown tileset
"use strict";

var SC = window.SC || {}

SC.tileset('map/tileset/ghosttown.png', [
    ['palette5', 'nowalk', 'barrierup', 'antennaleft', 'antennaright', 'bubble', 'captionleft', 'caption', 'captionright', 'painting', 'tombstone', 'shadow1', 'shadow2', 'shadow3', 'shadow4', 'shadow5'],
    ['bug-down', 'edited-cell', 'cabinet-up', 'list', 'phone', 'apple', 'flag', 'event', 'place', 'trashcan', 'deadrat', 'emptycan', 'applecore', 'rope', 'shadown9', 'shadow3c'],
    ['book-small', 'emerald', 'invisible', 'fish-up-walk1', 'fish-up-walk2', 'fish-up', 'info', 'splash1', 'splash2', 'unknown', 'drop', null, null, null, null, null],
    ['nw_l_ud', 'nw__rud', 'nw_lru_', 'nw_lrud', 'books1', 'book-of-spells', 'worms', 'fish', 'tomb-up', 'wellwater', 'frog', 'frogwell', 'herb-ground', 'herb', 'stair1', 'stair2'],
    ['nw_lr__', 'nw___ud', 'nw_lr_d', 'books0', 'books2', 'books3', 'hole', 'fishing_rod', 'tomb-down', "crack", "key", "ladder", "emerald_ring", "ring", "watches", "pickaxe"],
    ['nw_l_u_', 'nw___u_', 'nw__ru_', null, null, null, null, null, null, null, null, null, null, null, null, null],
    ['nw_l___', 'nw_____', 'nw__r__', null, 'roof7', 'roof8', 'roof9', null, null, null, null, null, null, null, null, null],
    ['nw_l__d', 'nw____d', 'nw__r_d', null, 'roof4', 'roof5', 'roof6', null, null, null, null, null, null, null, null, null],
    [null, null, null, null, 'roof1', 'roof2', 'roof3', null, null, null, null, null, null, null, null, null],
    [null, null, null, null, 'roofwall', null, 'roofbrick', null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
]);

SC.goodsAdd('barrierup', 'Barrier', 'Wooden barrier', false, true, 1);
SC.goodsAdd('painting', 'Painting', 'Nice oil painting', false, true, 1);
SC.goodsAdd('tombstone', 'Tombstone', 'Gray standing tombstone', false, true, 1);
SC.goodsAdd('cabinet-up', 'Cabinet', 'Cabinet facing up', false, true, 1);
SC.goodsAdd('list', 'Info', 'Framed information', false, true, 1);
//SC.goodsAdd('flag', 'Flag', 'Flag', false, true, 1);
SC.goodsAdd('trashcan', 'Trashcan', 'Metal trashcan', false, true, 1);
SC.goodsAdd('deadrat', 'Dead rat', 'Dead rat', true, true, 1);
SC.goodsAdd('emptycan', 'Empty can', 'Empty can', false, true, 1);
SC.goodsAdd('applecore', 'Apple core', null, false, true, 1);
SC.goodsAdd('book-small', 'Small book', null, false, true, 1);
SC.goodsAdd('books1', 'Books for bookshelves, vol. 1', null, false, true, 1);
SC.goodsAdd('books2', 'Books for bookshelves, vol. 2', null, false, true, 1);
SC.goodsAdd('books3', 'Books for bookshelves, vol. 3', null, false, true, 1);
SC.goodsAdd('tomb-up', 'Upper part of tomb', null, false, true, 1);
SC.goodsAdd('tomb-down', 'Lower part of tomb', null, false, true, 1);
SC.goodsAdd('crack', 'Crack on the floor or wall', null, false, true, 1);

SC.goodsAdd('roof1', 'Roof', null, false, true, 1);
SC.goodsAdd('roof2', 'Roof', null, false, true, 1);
SC.goodsAdd('roof3', 'Roof', null, false, true, 1);
SC.goodsAdd('roof4', 'Roof', null, false, true, 1);
SC.goodsAdd('roof5', 'Roof', null, false, true, 1);
SC.goodsAdd('roof6', 'Roof', null, false, true, 1);
SC.goodsAdd('roof7', 'Roof', null, false, true, 1);
SC.goodsAdd('roof8', 'Roof', null, false, true, 1);
SC.goodsAdd('roof9', 'Roof', null, false, true, 1);

