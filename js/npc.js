// Non-player characters
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.npcs = (function () {
    // object for controling npcs on map
    var self = {
        onmap: {},
        characters: {},
        changes: SC.storage.readObject('SC.npcs.changes', {})
    };

    function prepare(aNick, aCharacter) {
        // create GHOST character from parents and character itself
        //console.info('SC.npcs.prepare', aNick, aCharacter);

        // was it prepared before?
        if (self.characters.hasOwnProperty(aCharacter)) {
            return self.characters[aCharacter];
        }

        // first create empty character
        var all, parents, i;
        if (!GHOST.character.hasOwnProperty(aCharacter)) {
            throw "No such character '" + aCharacter + "' for nick '" + aNick + "'";
        }

        // to all add all parents
        all = [];
        parents = GHOST.character[aCharacter].parents;
        for (i = 0; i < parents.length; i++) {
            all.push(GHOST.character[parents[i]]);
        }

        // then add character itself
        all.push(GHOST.character[aCharacter]);

        // add it to cache
        self.characters[aCharacter] = all;
        //console.info('prepared', all);
    }

    self.createFromMap2 = function (aMap) {
        // create npcs cache for map in form of map.npc['5 3'] = 'Craig';
        var nick, npc;
        self.onmap = {};
        for (nick in SC.npcsDefault) {
            if (SC.npcsDefault.hasOwnProperty(nick)) {
                // local changes first
                if (self.changes.hasOwnProperty(nick)) {
                    npc = self.changes[nick];
                    if (npc.map === aMap.name) {
                        self.onmap[nick] = npc;
                    }
                    continue;
                }
                // defaults
                npc = SC.npcsDefault[nick];
                if (npc.map === aMap.name) {
                    self.onmap[nick] = npc;
                }
            }
        }
        console.log('OnMap ' + Object.keys(self.onmap).length + ' characters in ' + aMap.name);
    };

    self.render = function () {
        // render all visible npcs
        var nick, npc, dx, dy, offset = {
            "girl-sleep": { x: 0, y: -0.4 } // experimental
        };
        for (nick in self.onmap) {
            if (self.onmap.hasOwnProperty(nick)) {
                // is npc visible?
                npc = self.onmap[nick];
                if ((npc.x >= SC.player.sx)
                        && (npc.y >= SC.player.sy)
                        && (npc.x <= SC.player.sx + SC.sw)
                        && (npc.y <= SC.player.sy + SC.sh)) {
                    // render npc
                    //console.info(nicks[n], npc.x, npc.y, npc.tile);
                    dx = offset.hasOwnProperty(npc.tile) ? offset[npc.tile].x : 0;
                    dy = offset.hasOwnProperty(npc.tile) ? offset[npc.tile].y : 0;
                    SC.tile(SC.context1, [npc.tile], npc.x - SC.player.sx + dx, npc.y - SC.player.sy + dy);
                }
            }
        }
    };

    self.askChain = function (aCharacter, aQuestion) {
        // ask question
        var a, s;
        prepare(aCharacter.nick, aCharacter.character);
        GHOST.laterCharactersMoreImportant = true;
        aQuestion = GHOST.why.modify(aCharacter.nick, aQuestion);
        a = GHOST.askChain(self.characters[aCharacter.character], GHOST.appendQuestionMark(aQuestion), [0.0001, 0.0005, 0.001, 0.01, 0.1, 0.5, 0.9, 1]);
        GHOST.why.lastAnswer[aCharacter.nick] = a.answer;
        s = a.answer;
        if (a.tags && (a.tags.length > 0)) {
            SC.player.onTags(a.tags, aCharacter);
        }
        if (s.substr(0, 1) === '#') {
            SC.cmd.run(s);
            return {a: '', command: s, nick: aCharacter.nick, character: aCharacter.character, x: aCharacter.x, y: aCharacter.y, tags: a.tags };
        }
        return {a: s, nick: aCharacter.nick, character: aCharacter.character, x: aCharacter.x, y: aCharacter.y, tags: a.tags };
    };

    self.ask = function (aQuestion) {
        // ask question to nearest character
        // find nearest
        var nick, npc, d, nearest_distance = Number.MAX_VALUE, nearest = null;
        for (nick in self.onmap) {
            if (self.onmap.hasOwnProperty(nick)) {
                npc = self.onmap[nick];
                d = Math.sqrt(Math.pow(SC.player.x - npc.x, 2) + Math.pow(SC.player.y - npc.y, 2));
                if (d < nearest_distance) {
                    nearest_distance = d;
                    nearest = npc;
                }
            }
        }
        console.log('Closest is ' + (nearest && nearest.nick) + ' at distance ' + nearest_distance.toFixed(2));
        if (nearest_distance > 5) {
            return false;
        }
        // ask
        return self.askChain(nearest, aQuestion);
    };

    self.change = function (aNick, aCharacter, aMap, aX, aY, aTile) {
        // change one character and save it to storage
        SC.type.isString(aNick, 'aNick');
        SC.type.isString(aCharacter, 'aCharacter');
        SC.type.isString(aMap, 'aMap');
        SC.type.isInteger(aX, 'aX');
        SC.type.isInteger(aY, 'aY');
        SC.type.isString(aTile, 'aTile');
        SC.assert(SC.npcsDefault.hasOwnProperty(aNick), 'Unknown character ' + aNick);
        SC.assert(SC.tiles.hasOwnProperty(aTile), 'Unknown tile ' + aTile);
        self.changes[aNick] = {
            nick: aNick,
            character: aCharacter,
            map: aMap,
            x: aX,
            y: aY,
            tile: aTile
        };
        // change onmap cache if needed
        if (self.onmap.hasOwnProperty(aNick)) {
            self.onmap[aNick] = self.changes[aNick];
        }
        // save changes
        SC.storage.writeObject('SC.npcs.changes', self.changes);
        // force redraw
        SC.renderSafeKey = '';
        SC.renderSafe();
    };

    self.findNearestType = function (aType, aMaxDistance) {
        // find nearest NPC with given type (e.g. shopkeeper)
        var k, d;
        for (k in self.onmap) {
            if (self.onmap.hasOwnProperty(k)) {
                if (self.onmap[k].character === aType) {
                    d = Math.hypot(self.onmap[k].x - SC.player.x, self.onmap[k].y - SC.player.y);
                    if (d <= (aMaxDistance || 5)) {
                        return { npc: self.onmap[k], distance: d };
                    }
                }
            }
        }
    };

    self.getCanonicalName = function (aName) {
        // find character by name, case insensitive, ignore dashes
        var k, n = aName.toLowerCase().replace(/\-/g, '');
        for (k in self.onmap) {
            if (self.onmap.hasOwnProperty(k)) {
                if (k.toLowerCase().replace(/\-/g, '') === n) {
                    return k;
                }
            }
        }
    };

    self.walk = function (aNick, aPath, aCallback) {
        // animate npc walking
        var npc = self.onmap[aNick],
            dxy = {
                'L': { x: -1, y: 0, dir: 'left' },
                'R': { x: 1, y: 0, dir: 'right' },
                'U': { x: 0, y: -1, dir: 'up' },
                'D': { x: 0, y: 1, dir: 'down' },
                'l': { x: 0, y: 0, dir: 'left' },
                'r': { x: 0, y: 0, dir: 'right' },
                'u': { x: 0, y: 0, dir: 'up' },
                'd': { x: 0, y: 0, dir: 'down' }
            },
            walkframe = {
                0: '-walk1',
                1: '',
                2: '-walk2',
                3: ''
            },
            p,
            n,
            c = 4,
            f,
            speed = 150;
        p = aPath.charAt(0);
        n = aPath.substr(1);
        // end of walk?
        if (!p) {
            if (aCallback) {
                aCallback();
            }
            return;
        }
        // walking callback
        f = function () {
            npc.x += dxy[p].x / 4;
            npc.y += dxy[p].y / 4;
            npc.tile = npc.tile.split('-')[0] + '-' + dxy[p].dir + walkframe[c % 4];
            //console.info('SC.npcs.walk', npc.x, npc.y, npc.tile);
            SC.renderSafeKey = '';
            SC.renderSafe();
            c--;
            if (c > 0) {
                setTimeout(f, speed); // Timer to continue npc walking
            } else {
                setTimeout(function () { // Timer to stop npc walking and run next commands
                    self.walk(aNick, n, aCallback);
                }, speed);
            }
        };
        f();
    };

    return self;
}());

