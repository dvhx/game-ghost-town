// Inventory
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.createInventory = function (aInventoryName, aInitialData) {
    // Inventory
    var self = {},
        items = {};
    self.showedInventory = null;

    function load() {
        // Load inventory from local storage
        if (SC.storage.keyExists('SC.inventory.' + aInventoryName)) {
            items = SC.storage.readObject('SC.inventory.' + aInventoryName, {});
        } else {
            items = JSON.parse(JSON.stringify(aInitialData));
        }
    }
    load();
    console.log('SC.inventory.' + aInventoryName, items);

    function save() {
        // Save inventory to local storage
        SC.storage.writeObject('SC.inventory.' + aInventoryName, items);
    }

    self.add = function (aName, aAmount) {
        // Add to inventory
        if (aAmount === undefined) {
            aAmount = 1;
        }
        SC.type.isString(aName, 'aName');
        SC.type.isNumber(aAmount, 'aAmount');
        if (!items.hasOwnProperty(aName)) {
            items[aName] = 0;
        }
        var a = items[aName], b;
        items[aName] += aAmount;
        b = items[aName];
        if (items[aName] <= 0) {
            delete items[aName];
            b = 0;
        }
        save();
        return Math.abs(b - a);
    };

    self.set = function (aName, aAmount) {
        // Set amount of items in inventory, add if it is not there, remove excess amount
        // This is usefull for example if you want to have item in inventory only once
        if (aAmount === undefined) {
            aAmount = 1;
        }
        SC.type.isString(aName, 'aName');
        SC.type.isNumber(aAmount, 'aAmount');
        items[aName] = aAmount;
        var b = aAmount;
        if (items[aName] <= 0) {
            delete items[aName];
            b = 0;
        }
        return b;
    };

    self.remove = function (aName, aAmount) {
        // Remove from inventory, return amount of items that was successfully removed
        if (aAmount === undefined) {
            aAmount = 1;
        }
        return self.add(aName, -aAmount);
    };

    self.has = function (aName, aAmount) {
        // Return true if inventory has at least amount of item
        if (aAmount === undefined) {
            aAmount = 1;
        }
        SC.type.isString(aName, 'aName');
        SC.type.isNumber(aAmount, 'aAmount');
        SC.assert(aAmount > 0, 'SC.inventory.has(): aAmount must be larger than zero');
        return items.hasOwnProperty(aName) && items[aName] >= aAmount;
    };

    self.amount = function (aName) {
        // Return amount of items
        SC.type.isString(aName, 'aName');
        return items.hasOwnProperty(aName) ? items[aName] : 0;
    };

    self.keys = function () {
        // Return names of items in inventory
        return Object.keys(items);
    };

    self.eat = function (aName) {
        // eat something from inventory, e.g. 'apple'
        if (!self.has(aName)) {
            SC.player.bubble("I don't have " + aName);
            return 0;
        }
        if (!SC.goods.hasOwnProperty(aName)) {
            console.error('Unknown goods:' + aName);
        }
        if (!SC.goods[aName].edible) {
            SC.player.bubble(SC.goods[aName].title + ' is not edible!');
            return 0;
        }
        SC.player.bubble("Nom nom");
        SC.blink.show('-1 ' + aName);
        return self.remove(aName, 1);
    };

    self.drop = function (aName) {
        // drop something from inventory to current player position
        console.log('#inventory drop', aName);
        if (!self.has(aName)) {
            SC.player.bubble("I don't have " + aName);
            return 0;
        }
        if (!SC.goods[aName].drop) {
            SC.player.bubble(SC.goods[aName].title + ' cannot be dropped!');
            return 0;
        }
        SC.blink.show('-1 ' + SC.goods[aName].title);
        //
        var ground = SC.map.ground[SC.player.y][SC.player.x];
        ground.push('drop');
        ground.push(aName);
        SC.renderSafeKey = '';
        SC.renderSafe();
        SC.map.save();
        SC.toolbar.repeatable('#inventory drop ' + aName);
        return self.remove(aName, 1);
    };

    self.nearestPickable = function (aRange, aFlash) {
        // find nearest pickable item
        var px = SC.player.x,
            py = SC.player.y,
            x,
            y,
            d,
            m,
            mx,
            my,
            found = false;
        aRange = aRange || 3;
        m = aRange + 1;
        for (x = px - aRange; x < px + aRange; x++) {
            for (y = py - aRange; y < py + aRange; y++) {
                //console.log(x, y, SC.map.ground[y][x].join(', '));
                if ((x >= 0) && (y >= 0) && (y < SC.map.ground.length) && (x < SC.map.ground[0].length)) {
                    if (SC.map.ground[y][x].indexOf('drop') >= 0) {
                        console.log('pickable', x, y, SC.map.ground[y][x]);
                        // find nearest
                        d = Math.sqrt((px - x) * (px - x) + (py - y) * (py - y));
                        if (d < m) {
                            m = d;
                            mx = x;
                            my = y;
                            found = true;
                        }
                    }
                }
            }
        }
        // flash it shortly using questionmark
        if (found && aFlash) {
            console.log('found', mx, my, m);
            // put question mark on the ground
            SC.map.ground[my][mx].push('unknown');
            // render it
            SC.renderDoNotCallDirectly();
            // remove question mark
            SC.map.ground[my][mx].pop();
            SC.renderSafeKey = '';
            setTimeout(function () {
                SC.renderSafeKey = '';
                SC.renderSafe();
            }, 500);
        }
        if (found) {
            return [mx, my];
        }
    };

    self.pick = function () {
        // pick one item from the ground
        var ground = SC.map.ground[SC.player.y][SC.player.x], n, n2, near;
        SC.bubbles.clearForNick('player');
        if (ground.length < 2) {
            near = self.nearestPickable(10, true);
            if (near) {
                setTimeout(function () {
                    SC.player.bubble('Maybe over there');
                }, 500);
            } else {
                SC.player.bubble('Nothing to pick up');
            }
            return 0;
        }
        // is previous tile "drop"
        if (ground.slice(-2)[0] !== 'drop') {
            near = self.nearestPickable(10, true);
            if (near) {
                setTimeout(function () {
                    SC.player.bubble('Maybe over there');
                }, 500);
            } else {
                SC.player.bubble('Nothing to pick up');
            }
            return 0;
        }
        // remove tile itself
        n = ground.pop();
        n2 = n.replace('-ground', ''); // some items changes when they are picked from the ground (herb-ground becomes herb)
        if (self.add(n2) !== 1) {
            // if add failed return it to the ground
            ground.push(n);
            console.info('put back', n, n2);
        }
        console.log('n', n, 'n2', n2);
        SC.blink.show('+1 ' + SC.goods[n2].title);
        // remove also drop tile
        ground.pop();
        // render and save map
        SC.renderSafeKey = '';
        SC.renderSafe();
        SC.map.save();
    };

    self.show = function (aWalletInHeader) {
        // Show inventory content
        try {
            var k, a = SC.articles(), total = 0, g, i, keys = Object.keys(items).sort();
            // count total items
            for (k in items) {
                if (items.hasOwnProperty(k)) {
                    total += self.amount(k);
                }
            }
            if (aWalletInHeader) {
                a.header(SC.wallet.gold + ' gold, ' + SC.wallet.silver.length + ' silver');
            } else {
                a.header(total + ' items of ' + keys.length + ' types');
            }
            // show items
            for (i = 0; i < keys.length; i++) {
                if (!SC.goods.hasOwnProperty(keys[i])) {
                    console.warn('Unknown goods in inventory: ' + keys[i]);
                    continue;
                }
                g = SC.goods[keys[i]];
                if (!g) {
                    g = { tile: 'unknown', description: keys[i], price: null };
                }
                if (typeof g.inventory === 'boolean' && !g.inventory) {
                    continue;
                }
                a.inventory(g.tile || keys[i], g.description, g.price, self.amount(keys[i]));
            }
            self.showedInventory = SC.newspaperFromData('Inventory', a.main);
        } catch (e) {
            console.error(e);
        }
    };

    self.hide = function () {
        // hide recently showed inventory
        if (SC.inventory.showedInventory) {
            SC.inventory.showedInventory.close();
            SC.inventory.showedInventory = undefined;
        }
    };

    self.debug = function () {
        // show inventory in console for debugging purposes
        console.log(JSON.stringify(items, undefined, 2));
    };

    return self;
};

// player's inventory
SC.inventory = SC.createInventory('player', {
    apple: 5
});

// This command is equivalent to "#inventory show" but inventory is hidden
// command otherwise player could easily add any item to inventory
SC.commands["#items"] = {
    "summary": "Show items in inventory",
    "example": ["#items"],
    "callback": function (aParams) {
        SC.inventory.show();
        SC.cmd.run(aParams);
    }
};

// Commands
SC.commands["#inventory"] = {
    "summary": "Inventory commands, continue commands only on success",
    "hidden": true,
    "synopsis": [
        "#inventory - without parameters will show inventory",
        "#inventory add NAME AMOUNT - add AMOUNT of NAME items into inventory",
        "#inventory set NAME AMOUNT - set AMOUNT of NAME items in inventory, adds it if it is not there yet",
        "#inventory remove NAME AMOUNT - remove items from inventory",
        "#inventory require NAME AMOUNT - will only continue if player have enough items in inventory",
        "#inventory eat NAME - eat item from inventory",
        "#inventory drop NAME - drop item from inventory to the ground",
        "#inventory pick - pick topmost item from the ground to inventory",
        "#inventory hide - hide inventory",
        "#inventory debug - show inventory in console"
    ],
    "example": [
        "#inventory",
        "#inventory add pickaxe 1",
        "#inventory set tag:rocks 1",
        "#inventory remove herb 3",
        "#inventory require rope 1 ...",
        "#inventory require apple 0 #bubble \"I'm hungry\"",
        "#inventory eat apple",
        "#inventory drop apple",
        "#inventory pick",
        "#inventory hide",
        "#inventory debug"
    ],
    "callback": function (aParams) {
        var first = SC.cmd.first(aParams, ['add', 'remove', 'set', 'require', 'eat', 'drop', 'pick', 'hide', 'debug']),
            name,
            amount;

        // add item to inventory
        if (first === 'add') {
            name = SC.cmd.first(aParams);
            amount = parseInt(SC.cmd.first(aParams), 10);
            SC.assert(SC.goods.hasOwnProperty(name), 'Only goods can be added to inventory: ' + name);
            console.info('#inventory', first, name, amount);
            if (SC.inventory.add(name, amount) > 0) {
                SC.cmd.run(aParams);
            }
            return;
        }

        // set amount of item in inventory
        if (first === 'set') {
            name = SC.cmd.first(aParams);
            amount = parseInt(SC.cmd.first(aParams), 10);
            SC.assert(SC.goods.hasOwnProperty(name), 'Only goods can be added to inventory: ' + name);
            console.info('#inventory', first, name, amount);
            SC.inventory.set(name, amount);
            SC.cmd.run(aParams);
            return;
        }

        // remove item from inventory
        if (first === 'remove') {
            name = SC.cmd.first(aParams);
            amount = parseInt(SC.cmd.first(aParams), 10);
            SC.assert(SC.goods.hasOwnProperty(name), 'Only goods can be removed from inventory: ' + name);
            console.info('#inventory', first, name, amount);
            if (SC.inventory.remove(name, amount) > 0) {
                SC.cmd.run(aParams);
            }
            return;
        }

        // test if player has enough items
        if (first === 'require') {
            name = SC.cmd.first(aParams);
            amount = parseInt(SC.cmd.first(aParams), 10);
            SC.assert(SC.goods.hasOwnProperty(name), 'Only goods can be tested in inventory: ' + name);
            console.info('#inventory', first, name, amount);
            if (amount === 0) {
                // inventory require item 0 will continue only when user don't have such item
                if (!SC.inventory.has(name, 1)) {
                    SC.cmd.run(aParams);
                } else {
                    SC.cmd.finalize();
                }
            } else {
                if (SC.inventory.has(name, amount)) {
                    SC.cmd.run(aParams);
                } else {
                    SC.cmd.finalize();
                }
            }
            return;
        }

        // eat item from inventory
        if (first === 'eat') {
            name = SC.cmd.first(aParams);
            SC.assert(SC.goods.hasOwnProperty(name), 'Only goods can be removed from inventory: ' + name);
            console.info('#inventory', first, name);
            if (SC.inventory.eat(name) > 0) {
                SC.cmd.run(aParams);
            }
            return;
        }

        // drop item from inventory on the ground
        if (first === 'drop') {
            name = SC.cmd.first(aParams);
            if (SC.inventory.drop(name) > 0) {
                SC.cmd.run(aParams);
            }
            return;
        }

        // pick item from the ground to the inventory
        if (first === 'pick') {
            if (SC.inventory.pick() > 0) {
                SC.cmd.run(aParams);
            }
            return;
        }

        // hide inventory
        if (first === 'hide') {
            SC.inventory.hide();
            SC.cmd.run(aParams);
            return;
        }

        // debug inventory
        if (first === 'debug') {
            SC.inventory.debug();
            SC.cmd.run(aParams);
            return;
        }

        // show inventory
        SC.inventory.show();
        SC.cmd.run(aParams);
    }
};

