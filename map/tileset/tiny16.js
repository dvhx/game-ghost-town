// tiny16 tileset
"use strict";

var SC = window.SC || {}

SC.tileset('map/tileset/tiny16.png', [
    ['palette1', 'palette2', 'palette3', 'palette4', 'door1', 'door2', 'door3', 'door4', 'wall1', 'wall2', 'wall3', 'wall4', 'brick1', 'brick2', 'brick3', 'brick4'],
    ['switch1left', 'switch1up', 'switch1right', 'columntop', 'bars1', 'bars2', 'bars3', 'bars4', 'tree1', 'tree2', 'green3c', 'green1c', 'green7', 'green9', 'grass1', 'grass3'],
    ['switch2left', 'switch2up', 'switch2right', 'columnbottom', 'chest1', 'chest2', 'chest3', 'chest4', 'plant', 'trees', 'green9c', 'green7c', 'green1', 'green3', 'grass2', 'grass4'],
    ['switch3left', 'switch3up', 'switch3right', 'bedtop', 'pot1', 'pot2', 'pot3', 'pot4', 'treetop', 'tree3c', 'tree1c', 'road0', 'road3c', 'road1c', 'road7', 'road9'],
    ['switch4left', 'switch4up', 'switch4right', 'bedbottom', 'floor1', 'floor2', 'pilebrown', 'pilewhite', 'treebottom', 'tree9c', 'tree7c', 'road5', 'road9c', 'road7c', 'road1', 'road3'],
    ['fireplace7', 'fireplace8', 'fireplace9', 'shore7', 'shore8', 'shore9', 'void', 'lava1', 'lava2', 'sign', 'mine', 'fence1', 'fence2', 'carpet', 'carpet7', 'carpet9'],
    ['fireplace4', 'fireplace5', 'fireplace6', 'shore4', 'fireplace0', 'shore6', 'lavawall', 'cavewall', 'floor3', 'blanket', 'throne', 'table', 'cabinet', 'waterfall', 'carpet1', 'carpet3'],
    ['fireplace1', 'fireplace2', 'fireplace3', 'shore1', 'shore2', 'shore3', 'mud', 'cavewalldark', 'floor4', 'upstairs', 'downstairs', 'castle', 'town', 'water', 'water1', 'water2'],
    ['boy-down', 'boy-down-walk1', 'boy-down-walk2', 'girl-down', 'girl-down-walk1', 'girl-down-walk2', 'skeleton-down', 'skeleton-down-walk1', 'skeleton-down-walk2', 'rocks', 'well', 'columnbroken', 'statue', 'unknown1', 'unknown2', 'unknown3'],
    ['boy-left', 'boy-left-walk1', 'boy-left-walk2', 'girl-left', 'girl-left-walk1', 'girl-left-walk2', 'skeleton-left', 'skeleton-left-walk1', 'skeleton-left-walk2', 'gold', 'crystals', 'road4', 'road6', 'unknown4', 'unknown5', 'unknown6'],
    ['boy-right', 'boy-right-walk1', 'boy-right-walk2', 'girl-right', 'girl-right-walk1', 'girl-right-walk2', 'skeleton-right', 'skeleton-right-walk1', 'skeleton-right-walk2', 'boy-dead', 'boy-sleep', 'road8', 'road2', 'unknown7', 'unknown8', 'unknown9'],
    ['boy-up', 'boy-up-walk1', 'boy-up-walk2', 'girl-up', 'girl-up-walk1', 'girl-up-walk2', 'skeleton-up', 'skeleton-up-walk1', 'skeleton-up-walk2', 'girl-dead', 'girl-sleep', 'caveexit', 'skeleton-dead', 'unknown10', 'unknown11', 'unknown12'],
    ['slime-down', 'slime-down-walk1', 'slime-down-walk2', 'bat-down', 'bat-down-walk1', 'bat-down-walk2', 'ghost-down', 'ghost-down-walk1', 'ghost-down-walk2', 'spider-down', 'spider-down-walk1', 'spider-down-walk2', 'slime-dead', 'torchyellow1', 'torchyellow2', 'torchyellow3'],
    ['slime-left', 'slime-left-walk1', 'slime-left-walk2', 'bat-left', 'bat-left-walk1', 'bat-left-walk2', 'ghost-left', 'ghost-left-walk1', 'ghost-left-walk2', 'spider-left', 'spider-left-walk1', 'spider-left-walk2', 'bat-dead', 'torchblue1', 'torchblue2', 'torchblue3'],
    ['slime-right', 'slime-right-walk1', 'slime-right-walk2', 'bat-right', 'bat-right-walk1', 'bat-right-walk2', 'ghost-right', 'ghost-right-walk1', 'ghost-right-walk2', 'spider-right', 'spider-right-walk1', 'spider-right-walk2', 'ghost-dead', 'torchred1', 'torchred2', 'torchred3'],
    ['slime-up', 'slime-up-walk1', 'slime-up-walk2', 'bat-up', 'bat-up-walk1', 'bat-up-walk2', 'ghost-up', 'ghost-up-walk1', 'ghost-up-walk2', 'spider-up', 'spider-up-walk1', 'spider-up-walk2', 'spider-dead', 'torchgreen1', 'torchgreen2', 'torchgreen3']
]);

SC.goodsAdd('wall1', 'Stone wall', null, false, true, 2);
SC.goodsAdd('wall2', 'Stone wall', null, false, true, 2);
SC.goodsAdd('wall3', 'Stone wall', null, false, true, 2);
SC.goodsAdd('wall4', 'Stone wall', null, false, true, 2);
SC.goodsAdd('brick1', 'Brick wall', null, false, true, 3);
SC.goodsAdd('brick2', 'Brick wall', null, false, true, 3);
SC.goodsAdd('brick3', 'Brick wall', null, false, true, 3);
SC.goodsAdd('brick4', 'Brick wall', null, false, true, 3);
SC.goodsAdd('floor1', 'Wooden floor', null, false, true, 2);
SC.goodsAdd('floor2', 'Wooden floor', null, false, true, 2);
SC.goodsAdd('grass1', 'Grass', null, false, true, 1);
SC.goodsAdd('grass2', 'Grass', null, false, true, 1);
SC.goodsAdd('grass3', 'Grass', null, false, true, 1);
SC.goodsAdd('grass4', 'Grass', null, false, true, 1);
SC.goodsAdd('door1', 'Door closed', null, false, true, 3);
SC.goodsAdd('door4', 'Door opened', null, false, true, 3);
SC.goodsAdd('columntop', 'Column top', null, false, true, 2);
SC.goodsAdd('columnbottom', 'Column bottom', null, false, true, 2);
SC.goodsAdd('bars1', 'Bars closed', null, false, true, 2);
SC.goodsAdd('bars4', 'Bars opened', null, false, true, 2);
SC.goodsAdd('chest1', 'Chest closed', null, false, true, 3);
SC.goodsAdd('chest4', 'Chest opened', null, false, true, 3);
SC.goodsAdd('pot1', 'Pot', null, false, true, 1);
SC.goodsAdd('pilebrown', 'Pile of mud', null, false, true, 1);
SC.goodsAdd('pilewhite', 'Pile of white powder', null, false, true, 1);
SC.goodsAdd('sign', 'Sign', null, false, true, 5);
SC.goodsAdd('mine', 'Mine entrance', null, false, true, 10);
SC.goodsAdd('fence1', 'Fence', null, false, true, 1);
SC.goodsAdd('fence2', 'Fence', null, false, true, 1);
SC.goodsAdd('carpet', 'Carpet', null, false, true, 3);
SC.goodsAdd('carpet7', 'Carpet', null, false, true, 3);
SC.goodsAdd('carpet9', 'Carpet', null, false, true, 3);
SC.goodsAdd('floor3', 'Rock floor', null, false, true, 1);
SC.goodsAdd('floor4', 'Ceramic floor', null, false, true, 1);
SC.goodsAdd('blanket', 'Blanket', null, false, true, 4);
//SC.goodsAdd('throne', 'Throne', null, false, true, 1);
//SC.goodsAdd('table', 'Table', null, false, true, 1);
//SC.goodsAdd('cabinet', 'Cabinet', null, false, true, 1);
SC.goodsAdd('waterfall', 'Waterfall', null, false, true, 1);
SC.goodsAdd('carpet1', 'Carpet', null, false, true, 3);
SC.goodsAdd('carpet3', 'Carpet', null, false, true, 3);
SC.goodsAdd('upstairs', 'Upstairs', null, false, true, 10);
SC.goodsAdd('downstairs', 'Downstairs', null, false, true, 10);
SC.goodsAdd('well', 'Well', null, false, true, 5);
SC.goodsAdd('columnbroken', 'Column broken', null, false, true, 2);
SC.goodsAdd('statue', 'Statue', null, false, true, 5);
//SC.goodsAdd('torchyellow1', 'Yellow torch', null, false, true, 1);
SC.goodsAdd('torchred1', 'Red torch', null, false, true, 1);
SC.goodsAdd('torchgreen1', 'Green torch', null, false, true, 1);
SC.goodsAdd('torchblue1', 'Torch blue', null, false, true, 1);
SC.goodsAdd('cavewall', 'Cave wall', null, false, true, 1);
SC.goodsAdd('cavewalldark', 'Cave wall', null, false, true, 1);
SC.goodsAdd('mud', 'Mud', null, false, true, 1);
SC.goodsAdd('void', 'Void', null, false, true, 1);
SC.goodsAdd('shore1', 'Shore', null, false, true, 1);
SC.goodsAdd('shore2', 'Shore', null, false, true, 1);
SC.goodsAdd('shore3', 'Shore', null, false, true, 1);
SC.goodsAdd('shore4', 'Shore', null, false, true, 1);
SC.goodsAdd('shore6', 'Shore', null, false, true, 1);
SC.goodsAdd('shore7', 'Shore', null, false, true, 1);
SC.goodsAdd('shore8', 'Shore', null, false, true, 1);
SC.goodsAdd('shore9', 'Shore', null, false, true, 1);
SC.goodsAdd('lava1', 'Lava', null, false, true, 1);
SC.goodsAdd('lavawall', 'Lava wall', null, false, true, 1);

