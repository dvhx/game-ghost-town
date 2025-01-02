// Inividual commands
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {}
SC.commands = SC.commands || {};

SC.alert2 = function (aMessage, aHidePreviousAlerts, aNeverHide, aCallback) {
    // Show messages at the top of window, hide them after while
    var self = {}, p;

    if (aHidePreviousAlerts) {
        do {
            p = SC.dialogs.pop();
            if (p) {
                p.hide();
            }
        } while (p);
    }
    SC.dialogs.push(self);

    self.div = document.createElement('div');
    self.div.className = 'dh_alert';

    self.hide = function () {
        // hide this alert message
        //if (event) {
            //event.preventDefault();
        //}
        if (self.div.parentNode) {
            self.div.parentNode.removeChild(self.div);
        }
        if (aCallback) {
            aCallback();
        }
    };

    // close label
    self.close = document.createElement('div');
    self.close.innerHTML = '&times;';
    self.close.style.position = 'absolute';
    self.close.style.right = '0';
    self.close.style.top = '0';
    self.close.style.opacity = 0.3;
    self.close.style.paddingRight = '0.5ex';
    self.close.title = 'Click here or press ESC to close this message';
    self.div.appendChild(self.close);

    // message
    if (aMessage && aMessage.nodeType && aMessage.nodeType === 1) {
        self.div.appendChild(aMessage);
    } else {
        self.div.appendChild(document.createTextNode(aMessage));
    }
    self.div.style.position = 'fixed';
    self.div.style.top = '0px';
    self.div.style.left = '0px';
    self.div.style.border = '1px solid red';
    //self.div.style.bottom = '0px';
    self.div.style.width = '100%';
    self.div.style.boxSizing = 'border-box';
    self.div.style.textAlign = 'center';
    self.div.style.padding = '1em';
    self.div.style.backgroundColor = '#f77';
    self.div.style.fontSize = '16px';
    self.div.style.color = 'black';

    document.body.appendChild(self.div);

    if (!aNeverHide) {
        setTimeout(self.hide, 30000);
    }

    // close on click or touch
    self.div.addEventListener('click', self.hide, true);
    self.div.addEventListener('touchend', self.hide, true);

    self.green = function () {
        // make alert green instead of red
        self.div.style.backgroundColor = '#7fa';
        self.div.style.color = 'black';
        self.div.style.border = '1px solid #0c0';
    };

    return self;
};

// keep this command on the top of the source file
SC.commands["#test"] = {
    "summary": "Any temporary test code goes here",
    "hidden": true,
    "example": ["#test"],
    "callback": function (aParams) {
        console.log('url', document.location.toString(), aParams);
        SC.cmd.run('#goto 3 4 basement_ken #inventory add pickaxe 1 #blink "+1 pickaxe"');
        //SC.cmd.run('#purge #transaction start ( #test2 ) #intro off #reload');
    }
};

SC.commands["#tests"] = {
    "summary": "Any temporary test code goes here",
    "hidden": true,
    "example": ["#test2"],
    "commands": [
        "#purge",
        "#goto 3 4 basement_ken",
        "#inventory set tag:watches 0",
        "#inventory set watches 0",
        "#inventory add pickaxe 1",
        "#inventory add ladder 1",
        "#intro off",
        "#reload"
    ]
};

SC.commands["#land"] = {
    "summary": "Buy land at player's current position. Player must have at least one flag from land office. Only clean grassy areas can be bought. This feature is not finished yet.",
    "hidden": true,
    "example": ["#land"],
    "callback": function (aParams) {
        // buy land where player is standing
        var x = SC.player.x,
            y = SC.player.y,
            ground = SC.map.ground[y][x];
        console.info("buying land at ", x, y, ground);

        // only grassy areas can be bought
        if (!ground[0].match(/^grass/)) {
            SC.player.bubble('Only grassy areas can be bought');
            return;
        }
        // if something more is on the grass it cannot be purchased
        if (ground.length > 1) {
            SC.player.bubble('Cannot buy this lot, ' + ground.slice(1).join(' and ') + ' on the grass');
            return;
        }
        // take flag from inventory
        if (SC.inventory.remove('flag', 1) < 1) {
            SC.player.bubble("I don't have flag!");
            return;
        }
        // drop flag on ground
        SC.map.ground[y][x].push('flag');
        // save map
        SC.map.save(SC.map.name);
        SC.renderSafe();
        // next commands
        SC.cmd.run(aParams);
    }
};

SC.commands["#version"] = {
    "summary": 'Show source version',
    "example": ["#version"],
    "callback": function (aParams) {
        SC.player.bubble(SC.version);
        SC.cmd.run(aParams);
    }
};

SC.commands["#purge"] = {
    "summary": 'Completely erase storage (except silver)',
    "example": ["#purge"],
    "hidden": true,
    "callback": function (aParams) {
        SC.storage.eraseAll();
        // save the silver, will be restored after reload
        SC.storage.writeObject('SC.purgedSilver', SC.wallet.silver);
        SC.player.bubble('Storage purged');
        SC.cmd.run(aParams);
    }
};

SC.commands["#light"] = {
    "summary": "Set amount of light in scene, can be used to make whole screen darker, parameter is amount of light",
    "hidden": true,
    "synopsis": ["#light VALUE"],
    "example": ["#light 0 - pitch black", "#light 0.1 - almost black", "#light 0.5 - 50% black", "#light 1 - daylight (this is default)"],
    "callback": function (aParams) {
        var a = parseFloat(SC.cmd.first(aParams));
        SC.canvas1.style.opacity = a;
        SC.canvas2.style.opacity = a;
        SC.cmd.run(aParams);
    }
};

SC.commands["#hideconsole"] = {
    "summary": "Hide console, usually used as SC.rc command on desktop",
    "hidden": true,
    "example": ["#hideconsole"],
    "callback": function (aParams) {
        SC.cmd.hide();
        SC.cmd.run(aParams);
    }
};

SC.commands["#showconsole"] = {
    "summary": "Show console, usually used as SC.rc command on desktop",
    "hidden": true,
    "example": ["#showconsole"],
    "callback": function (aParams) {
        SC.cmd.show();
        SC.cmd.run(aParams);
    }
};

SC.commands["#button"] = {
    "summary": "Show button with 2 labels (first is bold, second is normal), when user press it the next commands will be executed",
    "hidden": true,
    "synopsis": ["#button FIRST SECOND COMMANDS"],
    "example": ["#button \"Use\" \"Toilet\" #delay 1000 #bubble \"Ahh, much better\""],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams),
            b = SC.cmd.first(aParams);
        SC.actionButton(a, b, function (aAction, aDetail) {
            console.log(aAction, aDetail);
            SC.cmd.run(aParams);
        });
    }
};

SC.commands["#ebutton"] = {
    "summary": "Show exclusive button (previous buttons will be hidden) with 2 labels (first is bold, second is normal), when user press it the next commands will be executed",
    "hidden": true,
    "synopsis": ["#button FIRST SECOND COMMANDS"],
    "example": ["#button \"Use\" \"Toilet\" #delay 1000 #bubble \"Ahh, much better\""],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams),
            b = SC.cmd.first(aParams);
        SC.actionButton(a, b, function (aAction, aDetail) {
            console.log(aAction, aDetail);
            SC.cmd.run(aParams);
        }, '1cm', true);
    }
};

SC.commands["#givebutton"] = {
    "summary": "Show button which will give certain amout of items to npc. The button only appears when player have enough of such items. It does not remove items from inventory, you must use #inventory remove after that.",
    "hidden": true,
    "synopsis": ["#givebutton NAME AMOUNT COMMANDS"],
    "example": ["#givebutton herb 3 #inventory remove herb 3 #bubble \"Take these 3 herbs...\""],
    "callback": function (aParams) {
        var type = SC.cmd.first(aParams),
            amount = parseInt(SC.cmd.first(aParams), 10);
        if (SC.inventory.has(type, amount)) {
            SC.actionButton('Give', amount + ' ' + SC.goods[type].title, function (aAction, aDetail) {
                console.log(aAction, aDetail);
                SC.cmd.run(aParams);
            });
        } else {
            console.info(amount + ' ' + type + ' required');
            SC.cmd.finalize();
        }
    }
};

SC.commands["#usebutton"] = {
    "summary": "Show button which will use certain amout of items. The button only appears when player have enough of such items. The item is used but remain in inventory, it is not consumed.",
    "hidden": true,
    "synopsis": ["#usebutton NAME AMOUNT COMMANDS"],
    "example": ["#usebutton rope 1"],
    "callback": function (aParams) {
        var type = SC.cmd.first(aParams),
            amount = parseInt(SC.cmd.first(aParams), 10);
        if (SC.inventory.has(type, amount)) {
            SC.actionButton('Use', (amount > 1 ? amount + ' ' : '') + SC.goods[type].title, function (aAction, aDetail) {
                console.log(aAction, aDetail);
                SC.cmd.run(aParams);
            });
        } else {
            console.info(amount + ' ' + type + ' required');
            SC.cmd.finalize();
        }
    }
};

SC.commands["#delay"] = {
    "summary": "Delay next command by some amount of milliseconds",
    "hidden": true,
    "synopsis": ["#delay AMOUNT COMMANDS"],
    "example": ["#delay 3000 #goto gallery", "#npcbubble Ken \"Dude\" #delay 3000 #npcbubble Ken \"Stop!\""],
    "callback": function (aParams) {
        var ms = parseInt(SC.cmd.first(aParams), 10);
        setTimeout(function () {    // Timeout for the #delay command
            SC.cmd.run(aParams);
        }, ms);
    }
};

SC.commands["#bubble"] = {
    "summary": "Show speech bubble above player",
    "hidden": true,
    "synopsis": ["#bubble WORD", "#bubble \"MULTIPLE WORDS\""],
    "example": ["#bubble Achoo", "#bubble \"Hello world!\""],
    "callback": function (aParams) {
        var msg = SC.cmd.first(aParams);
        console.info('#bubble', msg);
        SC.player.bubble(msg);
        SC.cmd.run(aParams);
    }
};

SC.commands["#bubbleclear"] = {
    "summary": "Clear speech bubble for specified character",
    "hidden": true,
    "synopsis": [
        "#bubbleclear NICK - clear bubble for NPC, use Player for player"
    ],
    "example": [
        "#bubbleclear Player",
        "#bubbleclear Ken",
        "#bubble Achoo #delay 300 #bubbleclear Player"
    ],
    "callback": function (aParams) {
        var nick = SC.cmd.first(aParams);
        if (nick) {
            SC.bubbles.clearForNick(nick);
        } else {
            SC.bubbles.clear('Player');
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#npcwalk"] = {
    "summary": "Move NPC relatively to its current position, L for Left, R for Right, U for Up, D for Down, and you can use lowercase letters l, r, u, d for turning without walking.",
    "hidden": true,
    "synopsis": ["#npcwalk NICK PATH COMMANDS"],
    "example": ["#npcwalk Skeleton RUUUd"],
    "callback": function (aParams) {
        var npc = SC.cmd.first(aParams),
            path = SC.cmd.first(aParams);
        if (npc && SC.npcs.onmap.hasOwnProperty(npc) && path) {
            SC.npcs.walk(npc, path, function () {
                SC.cmd.run(aParams);
            });
        } else {
            console.error('Invalid NPC', npc);
        }
    }
};

SC.commands["#npcbubble"] = {
    "summary": "Show speech bubble above npc",
    "hidden": true,
    "synopsis": ["#npcbubble NICK WORD COMMANDS", "#npcbubble NICK \"MULTIPLE WORD\" COMMANDS"],
    "example": ["#npcbubble Kim Achoo", "#npcbubble Ken \"Hello world!\""],
    "callback": function (aParams) {
        var npc = SC.cmd.first(aParams),
            msg = SC.cmd.first(aParams);
        if (npc && SC.npcs.onmap.hasOwnProperty(npc)) {
            if (msg) {
                SC.bubbles.add(npc, msg, SC.npcs.onmap[npc].x, SC.npcs.onmap[npc].y, true);
            } else {
                SC.bubbles.clearForNick(npc);
            }
            SC.cmd.run(aParams);
        } else {
            console.error('Invalid NPC', npc);
        }
    }
};

SC.commands["#npcchange"] = {
    "summary": "Change NPC attributes, parameters are: nick character map x y tile.",
    "hidden": true,
    "synopsis": ["#npcchange NICK CHARACTER MAP X Y TILE COMMANDS"],
    "example": ["#npcchange Kim kim_cured ghosttown 57 59 girl-down"],
    "callback": function (aParams) {
        var nick = SC.cmd.first(aParams),
            character = SC.cmd.first(aParams),
            map = SC.cmd.first(aParams),
            x = parseInt(SC.cmd.first(aParams), 10),
            y = parseInt(SC.cmd.first(aParams), 10),
            tile = SC.cmd.first(aParams);
        // checks
        console.info("#change nick:", nick, 'character:', character, 'map:', map, 'x:', x, 'y:', y, 'tile:', tile);
        SC.assert(SC.npcs.onmap.hasOwnProperty(nick), 'Nick must be on map');
        SC.assert(GHOST.character.hasOwnProperty(character), nick + ' must have character ' + character);
        SC.assert(SC.maps.hasOwnProperty(map), 'Unknown map ' + map);
        SC.assert(x >= 0, 'X cannot be negative');
        SC.assert(y >= 0, 'Y cannot be negative');
        SC.assert(SC.tiles.hasOwnProperty(tile), 'Unknown tile ' + tile);
        // change
        SC.npcs.change(nick, character, map, x, y, tile);
        SC.bubbles.clearForNick(nick);
        // next commands
        SC.cmd.run(aParams);
    }
};

SC.commands["#looking"] = {
    "summary": "Execute command when user is looking in specific direction (left, right, up, down)",
    "hidden": true,
    "synopsis": ["#looking DIRECTION COMMANDS"],
    "example": ["#looking up #bubble \"The doors are locked!\""],
    "callback": function (aParams) {
        var dir = SC.cmd.first(aParams);
        if (SC.player.dir === dir) {
            SC.cmd.run(aParams);
        } else {
            SC.cmd.finalize();
        }
    }
};

SC.commands["#caption"] = {
    "summary": "Show temporary decorated caption at the top of the screen",
    "hidden": true,
    "synopsis": ["#caption WORD COMMANDS", "#caption \"MULTIPLE WORDS\" COMMANDS"],
    "example": ["#caption Bank", "#caption \"Town hall\""],
    "callback": function (aParams) {
        var msg = SC.cmd.first(aParams);
        SC.caption.add(msg);
        SC.cmd.run(aParams);
    }
};

SC.commands["#walls"] = {
    "summary": 'Turn on/off walls',
    "hidden": true,
    "example": ["#walls"],
    "callback": function (aParams) {
        SC.walkableEverything = !SC.walkableEverything;
        SC.storage.writeBoolean('SC.walkableEverything', SC.walkableEverything);
        SC.renderSafeKey = '';
        SC.renderSafe();
        SC.cmd.run(aParams);
    }
};

SC.commands["#position"] = {
    "summary": "Show player's position in form of '#goto X Y' command in console",
    "hidden": true,
    "example": ["#position", "#pos"],
    "callback": function (aParams) {
        SC.cmd.error('#goto ' + SC.player.x + ' ' + SC.player.y + ' ' + SC.map.name);
        SC.cmd.run(aParams);
    }
};
SC.commands["#pos"] = SC.commands["#position"];

SC.commands["#zoom"] = {
    "summary": "Change zoom, default is 4",
    "synopsis": ["#zoom VALUE"],
    "example": ["#zoom 2"],
    "callback": function (aParams) {
        SC.zoom = parseInt(SC.cmd.first(aParams) || "4", 10);
        if (SC.zoom < 1) {
            SC.zoom = 1;
        }
        if (SC.zoom > 8) {
            SC.zoom = 8;
        }
        SC.storage.writeNumber('SC.zoom', SC.zoom);
        SC.player.center(true);
        SC.context2.clearRect(0, 0, SC.w, SC.h);
        SC.onResize();
        SC.cmd.run(aParams);
    }
};

SC.commands["##"] = {
    "summary": "Repeat previous command, only use it from console, not from commands",
    "example": ["##"],
    "callback": function () {
        SC.cmd.run(SC.cmd.history.slice(-1)[0]);
    }
};

SC.commands["#hk"] = {
    "summary": "Hide keyboard (on mobile)",
    "hidden": true,
    "example": ["#hk"],
    "callback": function (aParams) {
        SC.cmd.hideKeyboard();
        SC.cmd.run(aParams);
    }
};

SC.commands["#hk2"] = {
    "summary": "Hide keyboard (on desktop)",
    "hidden": true,
    "example": ["#hk2"],
    "callback": function (aParams) {
        SC.cmd.input.style.display = 'none';
        SC.cmd.run(aParams);
    }
};

SC.commands["#resize"] = {
    "summary": "Manually call SC.onResize() callback",
    "hidden": true,
    "example": ["#resize"],
    "callback": function (aParams) {
        SC.onResize();
        SC.cmd.run(aParams);
    }
};

SC.commands["#buy"] = {
    "summary": "Buy items in shop, if buying fails following commands will not be executed, this command is internally used by shop",
    "hidden": true,
    "synopsis": ["#buy NAME AMOUNT UNITPRICE"],
    "example": ["#buy tree1 3 15"],
    "callback": function (aParams) {
        if (!SC.npcs.findNearestType('shopkeeper', 3)) {
            SC.player.bubble('No shop nearby!');
            return false;
        }
        SC.assert(aParams.length >= 3, '#buy require 3 parameters: name amount unitPrice');
        var name = SC.cmd.first(aParams),
            amount = parseInt(SC.cmd.first(aParams), 10),
            unitPrice = parseInt(SC.cmd.first(aParams), 10),
            totalPrice = amount * unitPrice;
        // check if player has enough gold
        if (totalPrice > SC.wallet.gold) {
            SC.player.bubble('I need ' + totalPrice + ' gold!');
            return false;
        }
        // remove gold
        SC.wallet.gold -= totalPrice;
        SC.wallet.save();
        SC.blink.show(SC.wallet.gold + ' gold', true);
        // add item to inventory
        SC.inventory.add(name, amount);
        SC.player.bubble('+' + amount + ' ' + name);
        // run next commands
        SC.cmd.run(aParams);
        return true;
    }
};

SC.commands["#sell"] = {
    "summary": "Sell items in shop, if selling fails following commands will not be executed, this command is internally used by shop",
    "hidden": true,
    "synopsis": ["#sell NAME AMOUNT UNITPRICE"],
    "example": ["#sell tree1 3 15"],
    "callback": function (aParams) {
        if (!SC.npcs.findNearestType('shopkeeper', 3)) {
            SC.player.bubble('No shop nearby!');
            return false;
        }
        SC.assert(aParams.length >= 3, '#sell require 3 parameters: name amount unitPrice');
        var name = SC.cmd.first(aParams),
            amount = parseInt(SC.cmd.first(aParams), 10),
            unitPrice = parseInt(SC.cmd.first(aParams), 10),
            totalPrice = amount * unitPrice;
        // check if player has enough items
        if (SC.inventory.amount(name) < amount) {
            SC.player.bubble('I need ' + amount + ' of ' + name + '!');
            return false;
        }
        // remove item to inventory
        SC.inventory.remove(name, amount);
        SC.player.bubble('-' + amount + ' ' + name);
        // add gold
        SC.wallet.gold += totalPrice;
        SC.wallet.save();
        SC.blink.show(SC.wallet.gold + ' gold', true);
        SC.cmd.run(aParams);
        return true;
    }
};

SC.commands["#shop"] = {
    "summary": "Show shop where player can buy and sell goods",
    "hidden": true,
    "example": ["#shop"],
    "callback": function (aParams) {
        if (!SC.npcs.findNearestType('shopkeeper', 3)) {
            SC.player.bubble('No shop nearby!');
            return false;
        }

        // get all goods that are not essential to quests
        var all = JSON.parse(JSON.stringify(SC.goods));
        delete all.fish;
        delete all.emerald;
        delete all.ring;
        delete all.emerald_ring;
        delete all.ladder;
        delete all.rocks;
        delete all.crystals;
        delete all.rope;
        delete all.worms;
        delete all.key;
        delete all.watches;
        delete all.pickaxe;
        delete all.herb;
        delete all['tag:rocks'];
        delete all['tag:founder'];
        delete all['tag:skeleton'];
        delete all['tag:firetruck'];
        all = Object.keys(all);

        SC.init.await('SC.wallet,tileset', function () {
            SC.shop(
                "Steve's groceries",
                all, //["apple", "phone", "table", "cabinet", "bedtop", "bedbottom", "throne", "tree1", "tree2", "torchyellow1"],
                all  //["apple", "phone", "table", "cabinet", "bedtop", "bedbottom", "throne", "tree1", "tree2", "torchyellow1", "fishing_rod"]
            );
        });
        SC.cmd.run(aParams);
    }
};

SC.commands["#treasure"] = {
    "summary": "Give user small amount of gold, for example when user open treasure chest",
    "hidden": true,
    "synopsis": ["#treasure AMOUNT"],
    "example": ["#treasure 5"],
    "callback": function (aParams) {
        var g = parseInt(SC.cmd.first(aParams) || "1", 10);
        SC.type.isInteger(g);
        SC.wallet.gold += g;
        SC.wallet.save();
        SC.player.bubble('Found ' + g + ' gold!');
        SC.cmd.run(aParams);
    }
};

SC.commands["#help"] = {
    "summary": "Show list of all commands",
    "example": ["#help"],
    "callback": function (aParams) {
        var ar = SC.articles(), kk, k,
            more = SC.cmd.first(aParams, ['more']); // #help more will show hidden commands too
        kk = Object.keys(SC.commands).sort();
        // book of spells notes at the top
        ar.issue(SC.version);
        if (more) {
            ar.header('All ' + kk.length + ' commands & quests');
            ar.line();
        } else {
            ar.header('Basic commands');
        }
        // commands
        for (k = 0; k < kk.length; k++) {
            if (SC.commands[kk[k]]) {
                if (!SC.commands[kk[k]].hidden || (more === 'more')) {
                    if (SC.commands[kk[k]].summary) {
                        ar.title(kk[k]).style.textAlign = 'center';
                        ar.text(SC.commands[kk[k]].summary);
                        ar.synopsis(SC.commands[kk[k]].synopsis);
                        ar.examples(SC.commands[kk[k]].example);
                        ar.commands(SC.commands[kk[k]].commands);
                        ar.line();
                    }
                }
            }
        }
        SC.newspaperFromData(
            more ? 'Book of spells' : 'Ghosttown help',
            ar.main
        );
        SC.cmd.run(aParams);
    }
};

SC.commands["#center"] = {
    "summary": "Center viewport so that player is in the center of the screen",
    "example": ["#center"],
    "callback": function (aParams) {
        SC.context2.clearRect(0, 0, SC.w, SC.h);
        SC.player.center(true);
        SC.renderSafeKey = '';
        SC.renderSafe();
        SC.cmd.run(aParams);
    }
};

SC.commands["#inspect"] = {
    "summary": 'Inspect ground where player is standing, show ground tiles names, edge values, etc.',
    "hidden": true,
    "example": ["#inspect"],
    "callback": function (aParams) {
        var s = SC.cmd.error(SC.map.ground[SC.player.y][SC.player.x] + ' at ' + SC.player.x + ', ' + SC.player.y + ' e:' + SC.map.edge[SC.player.y][SC.player.x]);
        SC.cmd.run(aParams);
        return s;
    }
};

SC.commands["#edge"] = {
    "summary": 'Show or change edge value on player\'s current position',
    "hidden": true,
    "synopsis": ["#edge - show edge value", "#edge VALUE - change edge value"],
    "example": ["#edge", "#edge 2"],
    "callback": function (aParams) {
        var s = SC.cmd.error('#edge ' + SC.map.edge[SC.player.y][SC.player.x]);
        SC.cmd.run(aParams);
        return s;
    }
};

SC.commands["#text"] = {
    "summary": "Send short text message to character, this is useful when you want to talk to far away character whithout a need to walk there. NPC's answer will appear near edge of screen.",
    "synopsis": ["#text NICK MESSAGE"],
    "example": ["#text Cindy \"hello, how are you\""],
    "callback": function (aParams) {
        var npc = SC.npcs.getCanonicalName(SC.cmd.first(aParams)),
            text = SC.cmd.first(aParams),
            answer;
        console.log('#text', npc, text);
        if (npc) {
            answer = SC.npcs.askChain(SC.npcs.onmap[npc], text);
            SC.bubbles.add(answer.nick, answer.a, answer.x, answer.y, true);
            SC.wallet.addQuestion(text, answer.a, answer.character);
        } else {
            SC.cmd.error('Character "' + npc + '" is out of range!');
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#characters"] = {
    "summary": "Show list of all characters",
    "hidden": true,
    "example": ["#characters"],
    "callback": function (aParams) {
        var c, ar = SC.articles(), p = [], s;
        ar.line(true);
        // onmap characters
        for (c in SC.npcs.onmap) {
            if (SC.npcs.onmap.hasOwnProperty(c)) {
                p.push(c + ': ' + SC.npcs.onmap[c].character);
            }
        }
        ar.bl(p, 'On map');
        // ghost character
        p = [];
        for (c in GHOST.character) {
            if (GHOST.character.hasOwnProperty(c)) {
                s = GHOST.character[c].hasOwnProperty('parents') ? GHOST.character[c].parents.join(', ') : '';
                p.push(c + ': ' + s);
            }
        }
        ar.bl(p, 'Ghost characters');
        // show
        SC.newspaperFromData('Characters', ar.main);
        // next command
        SC.cmd.run(aParams);
    }
};

SC.commands["#places"] = {
    "summary": "Show list of all places",
    "hidden": true,
    "example": ["#places"],
    "callback": function (aParams) {
        var m, ma, p, ar = SC.articles(), places;
        ar.line(true);
        ma = Object.keys(SC.maps);
        ma.sort();
        for (m = 0; m < ma.length; m++) {
            ar.title(ma[m]);
            places = [];
            for (p in SC.maps[ma[m]].place) {
                if (SC.maps[ma[m]].place.hasOwnProperty(p)) {
                    places.push(SC.maps[ma[m]].place[p]);
                }
            }
            places.sort();
            ar.list(places);
        }
        SC.newspaperFromData('Places', ar.main);
        SC.cmd.run(aParams);
    }
};

SC.commands["#place"] = {
    "summary": "Without parameters it will show name of place on which player is standing, when string parameter is given it will set current player's position as named place, this can be later used for #goto command and for connecting two maps togeter",
    "hidden": true,
    "synopsis": ["#place", "#place NAME"],
    "example": ["#place", "#place cave"],
    "callback": function (aParams) {
        var x = Math.floor(SC.player.x),
            y = Math.floor(SC.player.y),
            s = SC.cmd.first(aParams),
            old = SC.map.findPlace(s);
        // "#place name" will set new place at player's position
        if (s) {
            if (old) {
                SC.player.bubble("Place '" + s + "' already exists elsewhere");
                return;
            }
            SC.map.place[x + ' ' + y] = s;
        }
        // print name of current place (if exists)
        if (!s && !SC.map.place[x + ' ' + y]) {
            SC.player.bubble('This place has no name');
        } else {
            SC.player.bubble('This place is called "' + SC.map.place[x + ' ' + y] + '"');
        }
        SC.fullRedraw();
        SC.cmd.run(aParams);
    }
};

SC.commands["#wallet"] = {
    "summary": 'Wallet operations',
    "synopsis": [
        "#wallet online - change wallet into online mode (this is recommended mode)",
        "#wallet offline - change wallet into offline mode",
        "#wallet export - export wallet for offline gold conversion",
        "#wallet info - show what\'s in the wallet using #bubble",
        "#wallet clear - remove all gold and silver from the wallet!",
        "#wallet gold VALUE HASH - import gold from offline wallet transaction",
        "#wallet convert - initiate online conversion of silver to gold",
        "#wallet silver - show all silver in wallet"
    ],
    "example": ["#wallet info", "#wallet gold 23 6c33ef2"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams, ["online", "offline", "clear", "clear", "export", "info", "convert", "gold", "silver", "copy"]),
            gold,
            hash,
            s;
        // set wallet online
        if (a === 'online') {
            SC.wallet.online = true;
            SC.wallet.save();
            SC.player.bubble('Wallet is now online');
        }
        // set wallet offline
        if (a === 'offline') {
            SC.wallet.online = false;
            SC.wallet.save();
            SC.player.bubble('Wallet is now offline');
        }
        // export for offline gold conversion
        if (a === 'export') {
            SC.wallet.export();
        }
        // show what's in the wallet
        if (a === "info") {
            SC.player.bubble("I have " + SC.wallet.gold + " gold and " + SC.wallet.silver.length + " silver in " + (SC.wallet.online ? "online" : "offline") + " wallet, " + SC.wallet.bank + " gold in bank");
        }
        // clear the wallet (you will lost all silver, this is mostly for debugging)
        if (a === 'clear') {
            SC.wallet.silver = [];
            SC.wallet.save();
            SC.cmd.run('#wallet info');
        }
        // receive gold from offline transaction (.wallet gold 1 5087d2c6)
        if (a === 'gold') {
            gold = SC.cmd.first(aParams);
            hash = SC.cmd.first(aParams);
            gold = SC.wallet.importGold(gold, hash);
            SC.player.bubble('Imported ' + gold + ' gold, total ' + SC.wallet.gold + ' gold in wallet!');
        }
        // show just the silver
        if (a === 'silver') {
            SC.newspaperFromRaw('Wallet silver', JSON.stringify(SC.wallet.silver, undefined, 1));
        }
        // next commands
        SC.cmd.run(aParams);
    }
};

SC.commands["#touch"] = {
    "summary": "Various settings of touch mode (on mobile)",
    "hidden": true,
    "synopsis": ["#touch on - enable touch mode", "#touch off - disable touch mode", '#touch threshold THRESHOLD - change threshold of arrows', '#touch log - show log'],
    "example": ["#touch on", "#touch off", "#touch threshold 0.6", "#touch log"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams, ["on", "off", "threshold", "log"]), t;
        if (a === 'on') {
            SC.touch.enabled = true;
            SC.storage.writeBoolean('SC.touch.enabled', SC.touch.enabled);
            SC.player.bubble('Touch is ' + (SC.touch.enabled ? 'enabled' : 'disabled'));
            SC.touch.element.style.display = 'block';
        }
        if (a === 'off') {
            SC.touch.enabled = false;
            SC.storage.writeBoolean('SC.touch.enabled', SC.touch.enabled);
            SC.player.bubble('Touch is ' + (SC.touch.enabled ? 'enabled' : 'disabled'));
            SC.touch.element.style.display = 'none';
        }
        if (a === 'log') {
            SC.newspaperFromRaw('Touch log', SC.touch.log.join('\n'));
        }
        if (a === 'threshold') {
            t = parseFloat(SC.cmd.first(aParams));
            if (t >= 0) {
                SC.touch.threshold = t;
                SC.player.bubble('Touch threshold is ' + SC.touch.threshold.toFixed(3));
            } else {
                console.error('#touch threshold ' + SC.touch.threshold.toFixed(3));
            }
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#redraw"] = {
    "summary": "Full redraw",
    "hidden": true,
    "example": ["#redraw"],
    "callback": function (aParams) {
        SC.fullRedraw();
        SC.cmd.run(aParams);
    }
};

SC.commands["#sleep"] = {
    "summary": "Put player to sleep",
    "example": ["#sleep"],
    "callback": function (aParams) {
        if (['boy', 'girl'].indexOf(SC.player.base) >= 0) {
            SC.player.dir = 'sleep';
        }
        SC.fullRedraw();
        SC.cmd.run(aParams);
    }
};
SC.commands["#stand"] = {
    "summary": "Make player stand facing down, used to wakup player from sleeping",
    "example": ["#stand"],
    "callback": function (aParams) {
        SC.player.dir = 'down';
        SC.fullRedraw();
        SC.cmd.run(aParams);
    }
};

SC.commands["#history"] = {
    "summary": "Show recent changes and fixes in game",
    "example": ["#history"],
    "callback": function (aParams) {
        SC.newspaperFromUrl('Ghosttown Journal', 'history.html');
        SC.cmd.run(aParams);
    }
};

SC.commands["#gallery"] = {
    "summary": "Show gallery image",
    "hidden": true,
    "synopsis": ["#gallery URL TITLE AUTHOR"],
    "example": ["#looking up #gallery \"image/lisa.png\" \"Mona Lisa\" \"Leonardo da Vinci\""],
    "callback": function (aParams) {
        var url = SC.cmd.first(aParams),
            title = SC.cmd.first(aParams),
            author = SC.cmd.first(aParams);
        SC.gallery(url, title, author, function () {
            if (SC.touch.enabled) {
                SC.cmd.show();
            }
            SC.cmd.run(aParams);
        });
    }
};

SC.commands["#player"] = {
    "summary": "Player commands",
    "synopsis": [
        "#player save - save player's position to local storage",
        "#player base NAME - change player's base tile"
    ],
    "hidden": true,
    "example": [
        "#player save",
        "#player base girl",
        "#player base boy",
        "#player base skeleton",
        "#player base ghost",
        "#player base bat",
        "#player base spider",
        "#player base slime"
    ],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams, ["save", "base"]), n;
        // save player's position
        if (a === 'save') {
            SC.player.save();
        }
        if (a === 'base') {
            n = SC.cmd.first(aParams);
            SC.player.base = n;
            SC.player.render();
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#lock"] = {
    "summary": "Lock player's movement, usually used for quests",
    "synopsis": ["#lock STATUS"],
    "hidden": true,
    "example": ["#lock on", "#lock off"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams, ["on", "off"]);
        SC.player.lock = a === 'on' ? true : false;
        SC.cmd.run(aParams);
    }
};

SC.commands["#mrr"] = {
    "summary": "Alias for: #map reset #reload",
    "hidden": true,
    "callback": function (aParams) {
        SC.cmd.run('#map reset #reload');
        SC.cmd.run(aParams);
    }
};

SC.commands["#map"] = {
    "summary": "Map commands",
    "hidden": true,
    "synopsis": [
        "#map reset - drop all local changes and restore maps from disk",
        "#map load - load map from local storage",
        "#map save - save map to local storage",
        "#map export - export map to download folder",
        "#map upgrade - manually upgrade map to newer version if available",
        "#map sub - create small rectangular sub-map defined by 'begin' and 'end' places"
    ],
    "example": [
        "#map reset",
        "#map load",
        "#map save",
        "#map export",
        "#map upgrade",
        "#goto 10 10 #place begin #goto 20 20 #place end #map sub"
    ],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams, ['reset', 'load', 'save', 'export', 'upgrade', 'sub']);
        // drop local changes and restore maps from disk
        if (a === 'reset') {
            SC.map.eraseAll();
        }
        // load map from local storage
        if (a === 'load') {
            SC.map.load(SC.map.name);
            SC.renderSafe();
        }
        // save map to local storage (incl. player's position)
        if (a === 'save') {
            SC.map.save(SC.map.name);
        }
        // export map and download it
        if (a === 'export') {
            SC.map.export();
        }
        // manually upgrade map to newer version
        if (a === 'upgrade') {
            SC.map.upgrade();
        }
        // create small rectangular sub-map defined by "begin" and "end" place
        if (a === 'sub') {
            if (!SC.map.places.hasOwnProperty('begin')) {
                SC.alert("Use '#place begin' to mark begining of the map");
                return;
            }
            if (!SC.map.places.hasOwnProperty('end')) {
                SC.alert("Use '#place end' to mark end of the map");
                return;
            }
            a = SC.map.sub(SC.map.places.begin.x, SC.map.places.begin.y, SC.map.places.end.x, SC.map.places.end.y, 'submap');
            SC.export(JSON.stringify(a, undefined, 4), 'ghosttown-submap', '.json', SC.cmd.show);
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#shortcut"] = {
    "summary": "Define keyboard shortcuts for simpler repeating of commands, only for PC version, you must have physical keyboard.",
    "hidden": true,
    "synopsis": ["#shortcut KEY COMMAND"],
    "example": ["#shortcut F1 #ground \"grass1\"", "#shortcut F2 #ground \"grass1 tree1\""],
    "callback": function (aParams) {
        SC.cmd.shortcuts[aParams[0]] = aParams.slice(1).join(' ');
    }
};

SC.commands["#alert"] = {
    "summary": "Show alert, user needs to click on close button to dismiss it so it is mostly for debugging purposes.",
    "hidden": true,
    "synopsis": ["#alert MESSAGE"],
    "example": ["#alert \"Something went wrong!\""],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams);
        SC.alert(a, true, undefined, SC.cmd.show);
        SC.cmd.run(aParams);
    }
};

SC.commands["#clearevent"] = {
    "summary": "Disable event at player's position, useful for one-time events.",
    "hidden": true,
    "synopsis": ["#clearevent"],
    "example": ["#bubble Achoo #clearevent", "#move up #clearevent #move down"],
    "callback": function (aParams) {
        delete SC.map.event[SC.player.xy];
        SC.cmd.run(aParams);
    }
};

SC.commands["#cleareventxy"] = {
    "summary": "Remove event at specified location",
    "hidden": true,
    "synopsis": ["#cleareventxy X Y"],
    "example": ["#cleareventxy 10 20"],
    "callback": function (aParams) {
        var x = parseInt(SC.cmd.first(aParams), 10),
            y = parseInt(SC.cmd.first(aParams), 10);
        delete SC.map.event[x + ' ' + y];
        SC.cmd.run(aParams);
    }
};

SC.commands["#event"] = {
    "summary": "Show or define or delete new event on current, use round brackets for complex commands or if you need to continue commands after event definition",
    "hidden": true,
    "synopsis": [
        "#event - print event at current player's position",
        "#event null - delete event at current position",
        "#event COMMAND - define single command event at current player's position",
        "#event ( COMMANDS ) - define complex command at current player's position, brackets must be separated by spaces! Brackets can be nested!"],
    "example": ["#event", "#event null", "#event #sleep", "#event ( #bubble Scary #event ( #bubble Meh ) )"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams); // use ( ) for complex commands if you want to continue
        // single event from console, no other commands
        if ((a === '') && (aParams.length > 0)) {
            a = SC.cmd.join(aParams);
            aParams = [];
        }
        if (a === '') {
            SC.cmd.error('#event ( ' + (SC.map.event[SC.player.xy] || '#nop') + ' )');
            return;
        }
        if (a === 'null') {
            delete SC.map.event[SC.player.xy];
        } else {
            SC.map.event[SC.player.xy] = a;
        }
        SC.renderSafe();
        console.log('#event', SC.player.xy, SC.map.event[SC.player.xy]);
        SC.cmd.run(aParams);
    }
};

SC.commands["#linkeventxy"] = {
    "summary": "Execute event on given coordinates, this is useful when copying event that can happen on multiple places",
    "hidden": true,
    "synopsis": ["#linkeventxy X Y"],
    "example": ["#linkeventxt 10 20"],
    "callback": function (aParams) {
        var x = parseInt(SC.cmd.first(aParams), 10),
            y = parseInt(SC.cmd.first(aParams), 10),
            s = SC.map.event[x + " " + y];
        if (s) {
            console.info('linkevent', s + ' ' + aParams.join(' '));
            SC.cmd.run(s + ' ' + aParams.join(' '));
        } else {
            console.warn('Cannot link event', x, y);
        }
    }
};

SC.commands["#groundremove"] = {
    "summary": "Remove single tile from ground if it is there without affecting other tiles, this is good for removing tiles from map e.g. by picking them up in quests, you could use #ground command but than you would have to know all other ground tiles, #groundremove is simpler to use on different terrains",
    "hidden": true,
    "synopsis": ["#groundremove TILE"],
    "example": ["#groundremove rocks"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams),
            g = SC.map.ground[SC.player.y][SC.player.x],
            i;
        if (a === '') {
            SC.cmd.error('#groundremove require tile name');
            return;
        }
        // remove tile A from ground
        for (i = g.length; i >= 0; i--) {
            if (g[i] === a) {
                g.splice(i, 1);
            }
        }
        // render map
        SC.map.modified = true;
        SC.renderSafeKey = null;
        SC.renderSafe();
        SC.cmd.run(aParams);
    }
};


SC.commands["#ground"] = {
    "summary": "Change ground tiles",
    "hidden": true,
    "synopsis": [
        "#ground - show ",
        "#ground TILE - change ground at player's position to TILE",
        "#ground \"TILES\" - change ground at player's position to TILES",
        "#ground \"TILES\" X Y - change ground at given coordinates"],
    "example": [
        "#ground",
        "#ground grass1",
        "#ground \"grass1 tree1\"",
        "#ground \"grass1 tree1\" 10 20"
    ],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams),
            b = parseInt(SC.cmd.first(aParams), 10),
            c = parseInt(SC.cmd.first(aParams), 10),
            p,
            x = isNaN(b) ? SC.player.x : b,
            y = isNaN(c) ? SC.player.y : c;

        console.log('#ground', a);
        // test if all tiles exists
        if (a !== '') {
            a = a.split(' ');
            for (p = 0; p < a.length; p++) {
                if (!SC.tiles.hasOwnProperty(a[p])) {
                    SC.cmd.error('#ground ' + a[p] + " # no such tile");
                    return;
                }
            }
            SC.map.ground[y][x] = a;
        } else {
            SC.cmd.error('#ground "' + SC.map.ground[y][x].join(' ') + '"');
        }
        // set ground tiles
        SC.map.modified = true;
        SC.renderSafeKey = null;
        SC.renderSafe();
        SC.cmd.run(aParams);
    }
};

SC.commands["#tiles"] = {
    "summary": "Show names of all tiles",
    "example": ["#tiles"],
    "hidden": true,
    "callback": function (aParams) {
        var k, t = [], a = SC.cmd.first(aParams);
        for (k in SC.tiles) {
            if (SC.tiles.hasOwnProperty(k)) {
                if (aParams.length > 0) {
                    if (k.match(a)) {
                        t.push(k);
                    }
                } else {
                    t.push(k);
                }
            }
        }
        t.sort();
        SC.newspaperFromRaw('Tile names', t.join(', '));
        SC.cmd.run(aParams);
    }
};

SC.commands["#debug"] = {
    "summary": "Show various informations, mostly for debugging",
    "hidden": true,
    "example": ["#debug history", "#debug storage", "#debug console"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams, ['history', 'storage', 'console']), k, keys, o = [], v;
        if (a === 'history') {
            SC.newspaperFromRaw('Command history', SC.cmd.history.join('\n'));
        }
        if (a === 'console') {
            console.show();
        }
        if (a === 'storage') {
            keys = SC.storage.keys();
            for (k = 0; k < keys.length; k++) {
                v = SC.storage.readString(keys[k]).substr(0, 1000);
                o.push(keys[k] + ': ' + v);
            }
            SC.newspaperFromRaw('Storage', o.join('\n\n'));
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#where"] = {
    "summary": "Locate character",
    "hidden": true,
    "synopsis": ["#where NICK"],
    "example": ["#where john"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams),
            n = SC.npcs.getCanonicalName(a);
        if (n) {
            SC.cmd.error('#goto ' + SC.npcs.onmap[n].x + ' ' + SC.npcs.onmap[n].y);
        } else {
            SC.cmd.error(a + ' not found');
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#withdraw"] = {
    "summary": "Withdraw gold from bank, you must be reasonably close to banker",
    "synopsis": ["#withdraw AMOUNT"],
    "example": ["#withdraw 30"],
    "callback": function (aParams) {
        var a = parseInt(SC.cmd.first(aParams), 10);
        a = SC.wallet.bankWithdraw(a);
        if (a > 0) {
            SC.player.bubble('Withdrawn ' + a + ' gold, I now have ' + SC.wallet.gold + ' gold, ' + SC.wallet.bank + ' in bank');
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#deposit"] = {
    "summary": "Deposit gold to bank, you must be reasonably close to banker",
    "synopsis": ["#deposit AMOUNT"],
    "example": ["#deposit 30"],
    "callback": function (aParams) {
        var a = parseInt(SC.cmd.first(aParams), 10);
        a = SC.wallet.bankDeposit(a);
        if (a > 0) {
            SC.player.bubble('Deposited ' + a + ' gold, I now have ' + SC.wallet.gold + ' gold, ' + SC.wallet.bank + ' in bank');
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#throw"] = {
    "summary": "Throw exception",
    "synopsis": ["#throw MESSAGE"],
    "example": ["throw \"Something went wrong\""],
    "hidden": true,
    "callback": function (aParams) {
        throw aParams.toString();
    }
};

SC.commands["#blink"] = {
    "summary": "Briefly display small notification on top of the screen",
    "synopsis": [
        "#blink MESSAGE - show message on top of the screen",
        "#blink - show ever increasing counter on top of the screen (mostly for debuging)"
    ],
    "example": ["#blink \"+3 gold\"", "#blink"],
    "hidden": true,
    "callback": function (aParams) {
        SC.blink.show(SC.cmd.first(aParams));
        SC.cmd.run(aParams);
    }
};

SC.commands["#toast"] = {
    "summary": "Show toast on android phone",
    "synopsis": ["#toast MESSAGE"],
    "example": ["#toast \"Quest completed\""],
    "hidden": true,
    "callback": function (aParams) {
        Android.showToast(SC.cmd.first(aParams));
        SC.cmd.run(aParams);
    }
};

SC.commands["#nop"] = {
    "summary": "This command do nothing, it can be used as a placeholder or for commands that expect another command as parameter",
    "hidden": true,
    "example": ["#nop"],
    "callback": function (aParams) {
        console.log('nop', aParams);
        SC.cmd.run(aParams);
    }
};

SC.commands["#break"] = {
    "summary": "Break multiple command execution, commands after break will not be executed",
    "example": ["#bubble banana #break #bubble apple"],
    "hidden": true,
    "callback": function (aParams) {
        console.log('break', aParams);
    }
};

SC.commands["#reload"] = {
    "summary": "Reload page",
    "example": ["#reload"],
    "hidden": true,
    "callback": function (aParams) {
        Android.reload();
        SC.cmd.run(aParams);
    }
};

SC.commands["#goto"] = {
    "summary": "Move player to a different place",
    "hidden": true,
    "synopsis": [
        "#goto X Y - go to coordinates on current map",
        "#goto X Y MAP - go to coordinates on different map",
        "#goto PLACE - move player to named place on current map",
        "#goto PLACE MAP - go to named place on different map"
    ],
    "example": [
        "#goto 10 20",
        "#goto 10 20 ghosttown",
        "#goto center",
        "#goto center ghosttown"
    ],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams),
            b = SC.cmd.first(aParams),
            c = SC.cmd.first(aParams),
            x = parseInt(a, 10),
            y = parseInt(b, 10),
            p,
            m;

        SC.renderSafeKey = '';

        // #goto x y
        if ((c === '') && !isNaN(x) && !isNaN(y)) {
            SC.player.goto(x, y, true);
            SC.player.center(true);
            SC.onResize();
            SC.player.save();
            SC.cmd.run(aParams);
            return;
        }

        // #goto x y map
        m = SC.maps.hasOwnProperty(c) ? SC.maps[c] : '';
        if (m && !isNaN(x) && !isNaN(y)) {
            SC.map.load(m.name);
            SC.player.goto(x, y, true);
            SC.player.center(true);
            SC.onResize();
            SC.player.save();
            SC.cmd.run(aParams);
            return;
        }

        // #goto place map
        m = SC.maps.hasOwnProperty(b) ? SC.maps[b] : '';
        p = SC.map.findPlace(a, m);
        if (isNaN(x) && isNaN(y) && p && m) {
            if (SC.map.name !== m.name) {
                SC.map.load(m.name);
            }
            SC.player.goto(p.x, p.y, true);
            SC.player.center(true);
            SC.onResize();
            SC.player.save();
            SC.cmd.run(aParams);
            return;
        }

        // #goto place
        if (isNaN(x) && p) {
            if (SC.map.name !== p.map) {
                SC.map.load(p.map);
            }
            SC.player.goto(p.x, p.y, true);
            SC.player.center(true);
            SC.onResize();
            SC.player.save();
            SC.cmd.run(aParams);
            return;
        }

        SC.cmd.error(' # invalid location', true);
    }
};
SC.commands["#go"] = SC.commands["#goto"];

SC.commands["#move"] = {
    "summary": "Similar to #goto but player is not redrawn, this is useful for commands which require changing environment near player's position, not at actuall player position. Parameters are either absolute coordinates or direction.",
    "hidden": true,
    "synopsis": [
        "#move X Y",
        "#move DIRECTION"
    ],
    "example": [
        "#move 10 20",
        "#move left",
        "#move right",
        "#move up",
        "#move down",
        "#move left #groundremove rocks #move right"
    ],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams),
            b = SC.cmd.first(aParams),
            x = parseInt(a, 10),
            y = parseInt(b, 10),
            dir = {
                "left": { dx: -1, dy: 0 },
                "right": { dx: 1, dy: 0 },
                "up": { dx: 0, dy: -1 },
                "down": { dx: 0, dy: 1 }
            };
        // left, right, up, down
        if (dir.hasOwnProperty(a)) {
            SC.player.goto(SC.player.x + dir[a].dx, SC.player.y + dir[a].dy);
            SC.renderSafeKey = [SC.player.x, SC.player.y, SC.player.dir, SC.player.sx, SC.player.sy, SC.w, SC.h].join(',');
            SC.cmd.run(aParams);
            return;
        }
        // x, y
        if (!isNaN(x) && !isNaN(y)) {
            SC.player.goto(x, y);
            SC.renderSafeKey = [SC.player.x, SC.player.y, SC.player.dir, SC.player.sx, SC.player.sy, SC.w, SC.h].join(',');
            SC.cmd.run(aParams);
            return;
        }
    }
};

SC.commands["#iftime"] = {
    "summary": "Execute command if time is exactly equal first parameter. Time is in 24 hour format.",
    "hidden": true,
    "synopsis": [
        "#iftime HH:MM"
    ],
    "example": [
        "#iftime 18:40 #goto 20 30"
    ],
    "callback": function (aParams) {
        var f = SC.cmd.first(aParams),
            a = new Date(),
            h = a.getHours(),
            m = a.getMinutes(),
            s = (h > 9 ? h.toString() : '0' + h.toString()) + ':' + (m > 9 ? m.toString() : '0' + m.toString());
        if (s === f) {
            SC.cmd.run(aParams);
        } else {
            SC.cmd.finalize();
        }
    }
};

SC.commands["#ifminute"] = {
    "summary": "Execute command if current time minutes is exactly equal first parameter.",
    "hidden": true,
    "synopsis": [
        "#ifminute MM"
    ],
    "example": [
        "#ifminute 25 #goto 20 30"
    ],
    "callback": function (aParams) {
        var f = SC.cmd.first(aParams),
            a = new Date(),
            m = a.getMinutes(),
            s = m > 9 ? m.toString() : '0' + m.toString();
        if (s === f) {
            SC.cmd.run(aParams);
        } else {
            SC.cmd.finalize();
        }
    }
};

SC.commands["#step"] = {
    "summary": "Force triggering step event, step events are only triggered by player's movement, but sometimes you need to trigger it in commands. Typically after goto which does not trigger step events (to prevent player being sent back after going through doors)",
    "hidden": true,
    "synopsis": [
        "#step"
    ],
    "example": [
        "#goto 3 1 #step"
    ],
    "callback": function (aParams) {
        SC.player.steps = {};
        SC.player.onStep();
        SC.cmd.run(aParams);
    }
};

SC.commands["#reread"] = {
    "summary": "Reread recent speeches, displayed automatically as reread button after verbose quests",
    "example": [
        "#reread"
    ],
    "callback": function (aParams) {
        SC.actionButton('Read', 'again', function () {
            SC.bubbles.showHistory();
        }, '30vh');
        SC.cmd.run(aParams);
    }
};

SC.commands["#bank"] = {
    "summary": "Show bank info",
    "example": [
        "#looking up #bank2"
    ],
    "callback": function (aParams) {
        if (SC.bank && SC.bank.main.parentElement) {
            console.log('Bank already visible');
            return;
        }
        var ar = SC.articles();
        ar.line(true);
        ar.title('Dear customer');
        ar.text("You have " + SC.wallet.gold + " gold in our bank. You can use them to purchase goods in Ghosttown shop. You'll receive more gold for playing this game longer.");
        ar.text("Thank you for choosing Ghosttown bank.");
        SC.bank = SC.newspaperFromData('Bank', ar.main);
        SC.cmd.run(aParams);
    }
};

SC.commands["#progress"] = {
    "summary": "Monitor and report on quests progress",
    "hidden": true,
    "synopsis": [
        "#progress start NAME - mark quest as started",
        "#progress finish NAME - mark quest as finished",
        "#progress report - send quests progress report to server"
    ],
    "example": ["#progress start frog", "#progress finish frog"],
    "callback": function (aParams) {
        var a = SC.cmd.first(aParams, ['start', 'finish', 'report']),
            q;
        switch (a) {
        case "start":
            q = SC.cmd.first(aParams);
            SC.wallet.progressStart(q);
            break;
        case "finish":
            q = SC.cmd.first(aParams);
            SC.wallet.progressFinish(q);
            break;
        case "report":
            SC.wallet.progressReport();
            break;
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#ending"] = {
    "summary": "Show ending screen",
    "hidden": true,
    "example": ["#ending"],
    "callback": function (aParams) {
        var ar = SC.articles(), ta, n;

        // mark game as finished
        if (!SC.wallet.progress.hasOwnProperty('library')) {
            SC.wallet.progressStart('library');
        }
        if (!SC.wallet.progress.library.hasOwnProperty('finish')) {

            // create ending page
            ar.issue();
            ar.header("You've made it!");
            ar.text('You have successfully obtained key and unlocked the library. All people of Ghosttown will be very grateful. They can enjoy studying in this library once again.');
            ar.text('There is one more surprise for you. On the table is Book of spells. This powerfull magic book will give you unlimited access to the game. With great power comes great responsibility. Please obey these few rules:');
            ar.ol([
                "You shall not reveal these spells to those who haven't finished the quests themselves!",
                "These commands are mostly for programmers and those who want to modify the game, these commands gives you unlimited access to the game. You can easily break the game. So be careful!"
            ]);
            ar.br();
            ar.text("OK, that's it for now. I have many plans what to do next in this game but it's gonna take some time. See you then.");
            ar.button('Continue', function () {
                SC.wallet.progressFinish('library');
                n.close();
            });

            n = SC.newspaperFromData('Congratulation', ar.main, function () {
                if (Android.isReal()) {
                    SC.cmd.show();
                }
            });
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#bugreport"] = {
    "summary": "Show button for sending bug reports",
    "hidden": true,
    "example": ["#bugreport"],
    "callback": function (aParams) {
        //SC.cmd.run('#caption No bug reports to file');
        SC.cmd.run(aParams);
    }
};

SC.commands["#pick"] = {
    "summary": "Pick something from the ground that you previously dropped",
    "hidden": true,
    "example": ["#pick"],
    "callback": function (aParams) {
        SC.player.bubble('Nothing to pick');
        SC.cmd.run(aParams);
    }
};

SC.commands["#pickhelp"] = {
    "summary": "Show hint how to pick up items",
    "example": [
        "#pickhelp"
    ],
    "callback": function (aParams) {
        Android.showToast('Use green arrow to pick items');
        var e = document.getElementById('tool_pick');
        function show() {
            e.style.opacity = 1;
        }
        function hide() {
            e.style.opacity = 0.3;
        }
        setTimeout(hide, 300);
        setTimeout(show, 600);
        setTimeout(hide, 900);
        setTimeout(show, 1200);
        setTimeout(hide, 1500);
        setTimeout(show, 1800);
        SC.cmd.run(aParams);
    }
};

SC.commands["#candidates"] = {
    "summary": "Show chatbot candidate answers for last question",
    "hidden": true,
    "example": ["#candidates"],
    "callback": function (aParams) {
        SC.console.showRaw(JSON.stringify(GHOST.recentCandidates, undefined, 2));
        SC.cmd.run(aParams);
    }
};

SC.commands["#keyboard"] = {
    "summary": "Keyboard commands",
    "hidden": true,
    "example": ["#keyboard clear - clear the keyboard buffer"],
    "callback": function (aParams) {
        var f = SC.cmd.first(aParams);
        switch (f) {
        case "clear":
            SC.keyboard.clear();
            break;
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#turn"] = {
    "summary": "Turn player in certain direction",
    "hidden": true,
    "synopsis": ["#turn DIRECTION - turn player to direction"],
    "example": ["#turn left", "#turn right", "#turn up", "#turn down"],
    "callback": function (aParams) {
        var n = SC.cmd.first(aParams);
        SC.player.turn(n);
        SC.cmd.run(aParams);
    }
};

SC.commands["#book"] = {
    "summary": "Show magic book",
    "hidden": true,
    "synopsis": ["#book NAME SPELLS... - display book with name containing these spells"],
    "example": ["#book \"Gender magic\" manus waifus"],
    "callback": function (aParams) {
        var n = SC.cmd.first(aParams), s, ss = [];
        while (true) {
            s = SC.cmd.first(aParams);
            if (s === '') {
                break;
            }
            ss.push('#' + s);
        }
        console.log('book', n, ss);
        SC.magicBook(n, ss);
        SC.cmd.run(aParams);
    }
};

SC.commands["#bookshelf"] = {
    "summary": "Look onto bookshelf",
    "hidden": true,
    "synopsis": ["#bookshelf NAME - display bookshelf with books"],
    "example": ["#bookshelf 1", "#bookshelf 2", "#bookshelf 3"],
    "callback": function (aParams) {
        var f = SC.cmd.first(aParams);
        switch (f) {
        case "1":
            SC.cmd.run('#looking up #ebutton Read "Black magic" #book "Black magic" skeletus ghostire slimare');
            break;
        case "2":
            SC.cmd.run('#looking up #ebutton Read "Ugly magic" #book "Ugly magic" spiderix batus');
            break;
        case "3":
            SC.cmd.run('#looking up #ebutton Read "Gender magic" #book "Gender magic" manus waifus');
            break;
        case "4":
            SC.cmd.run('#looking up #ebutton Read "White magic" #book "White magic" sleep');
            break;
        case "5":
            SC.cmd.run('#looking up #ebutton Read "Confusion magic" #book "Confusion magic" confusion');
            break;
        case "6":
            SC.cmd.run('#looking up #ebutton Read "Non magic" #book "Non magic" nop');
            break;
        }
        SC.cmd.run(aParams);
    }
};

SC.commands["#confusion"] = {
    "summary": "Spell for confusing player",
    "hidden": true,
    "commands": [ "#light 0.4 #delay 100 #light 0.1 #delay 100 #light 1 #delay 100 #light 0.4 #delay 100 #light 0.1 #delay 100 #light 1 #delay 100 #light 0.4 #delay 100 #light 0.1 #delay 100 #light 1 #delay 100 #light 0.4 #delay 100 #light 0.1 #delay 100 #light 1 #delay 100" ]
};

SC.commands["#manus"] = {
    "summary": "Spell for turning player into boy",
    "hidden": true,
    "commands": [ "#player base boy" ]
};

SC.commands["#waifus"] = {
    "summary": "Spell for turning player into girl",
    "hidden": true,
    "commands": [ "#player base girl" ]
};

SC.commands["#skeletus"] = {
    "summary": "Spell for turning player into skeleton",
    "hidden": true,
    "commands": [ "#player base skeleton" ]
};

SC.commands["#ghostire"] = {
    "summary": "Spell for turning player into ghost",
    "hidden": true,
    "commands": [ "#player base ghost" ]
};

SC.commands["#slimare"] = {
    "summary": "Spell for turning player into slime",
    "hidden": true,
    "commands": [ "#player base slime" ]
};

SC.commands["#spiderix"] = {
    "summary": "Spell for turning player into spider",
    "hidden": true,
    "commands": [ "#player base spider" ]
};

SC.commands["#batus"] = {
    "summary": "Spell for turning player into bat",
    "hidden": true,
    "commands": [ "#player base bat" ]
};

SC.commands["#restart"] = {
    "summary": "Restart game from the begining, all progress will be lost!",
    "hidden": true,
    "commands": [ "#purge #reload" ]
};

SC.commands["#quests"] = {
    "summary": "Quests indicator commands",
    "hidden": true,
    "synopsis": [
        "#quests show - show quests",
        "#quests add KEY TITLE - add new quest with given KEY and TITLE",
        "#quests progress KEY PERCENT - change quest progress",
        "#quests inc KEY PERCENT - increment quest progress",
        "#quests hide KEY HIDDEN - make quest visible if HIDDEN is 'true' or hidden if 'false'"
    ],
    "example": [
        "#quests show",
        "#quests add herb \"Help Ken find cure for Kim\"",
        "#quests add fish \"Help fisherman catch 3 fish\"",
        "#quests progress herb 100",
        "#quests inc rocks 30",
        "#quests hide fish true",
        "#quests hide fish false"
    ],
    "callback": function (aParams) {
        var f = SC.cmd.first(aParams), key, title, hidden, percent;
        if (f === 'show') {
            SC.quests.show();
        }
        if (f === 'add') {
            key = SC.cmd.first(aParams);
            title = SC.cmd.first(aParams);
            SC.quests.add(key, title);
        }
        if (f === 'progress') {
            key = SC.cmd.first(aParams);
            percent = parseInt(SC.cmd.first(aParams), 10);
            SC.quests.progress(key, percent);
        }
        if (f === 'inc') {
            key = SC.cmd.first(aParams);
            percent = parseInt(SC.cmd.first(aParams), 10);
            if (SC.quests.quests.hasOwnProperty(key)) {
                SC.quests.add(key);
                SC.quests.quests[key].percent += percent;
                SC.quests.save();
            }
        }
        if (f === 'hide') {
            key = SC.cmd.first(aParams);
            hidden = SC.cmd.first(aParams) === 'true';
            SC.quests.quests[key].hidden = hidden;
            SC.quests.save();
        }
        // next
        SC.cmd.run(aParams);
    }
};

SC.navigator = function () {
    // return printable navigator info
    var o = {}, k;
    for (k in navigator) {
        if (['string', 'number', 'boolean'].indexOf(typeof navigator[k]) >= 0) {
            o[k.toString()] = navigator[k];
        }
    }
    // detect android version
    try {
        o.androidVersion = navigator.appVersion.match(/Android [0-9\.]+/);
        if (Array.isArray(o.androidVersion)) {
            o.androidVersion = o.androidVersion.join(', ');
        }
    } catch (e) {
        o.androidVersion = e;
    }
    return o;
};

SC.commands["#navigator"] = {
    "summary": "Show all available browser info, used for debuging",
    "hidden": true,
    "callback": function (aParams) {
        SC.console.showRaw(JSON.stringify(SC.navigator(), undefined, 4));
        SC.cmd.run(aParams);
    }
};


