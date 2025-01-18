// Map (ground, objects, ...)
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.map = {};

SC.map.getXY = function (aXY, aIndex) {
    // convert 'x y' to x or y
    return parseInt(aXY.split(' ')[aIndex], 10);
};

SC.map.fromObject = function (aObj) {
    // copy map values from object
    SC.map.name = aObj.name;
    SC.map.version = aObj.version;
    SC.map.modified = aObj.modified;
    SC.map.ground = aObj.ground;
    SC.map.event = aObj.event;
    SC.map.place = aObj.place;
    SC.map.updatePlaceByName();
    SC.map.npc = aObj.npc;
    SC.map.width = aObj.width;
    SC.map.height = aObj.height;
    SC.map.edge = aObj.edge;
    SC.map.layer = aObj.layer;
};

SC.map.load = function (aMapName) {
    // Change current map to different map (e.g. "ghosttown" to "gallery2")
    console.info('SC.map.load', aMapName);
    SC.assert(SC.maps.hasOwnProperty(aMapName), "Unknown map: " + aMapName);
    var m = SC.maps[aMapName];
    // prefer data from storage
    if (SC.storage.keyExists('SC.map.' + aMapName)) {
        m = SC.storage.readObject('SC.map.' + aMapName, {});
    }
    SC.map.fromObject(m);
    SC.npcs.createFromMap2(SC.map);
    SC.map.upgrade();
};

SC.map.updatePlaceByName = function () {
    // create lookup object to access place coordinates by it's name rather than coordinates
    var xy;
    SC.map.placeByName = {};
    for (xy in SC.map.place) {
        if (SC.map.place.hasOwnProperty(xy)) {
            SC.map.placeByName[SC.map.place[xy]] = {
                x: SC.map.getXY(xy, 0),
                y: SC.map.getXY(xy, 1)
            };
        }
    }
};

SC.map.save = function () {
    // save map
    SC.storage.writeObject('SC.map.' + SC.map.name, SC.map);
};

SC.map.export = function () {
    // export map and download it as file
    SC.export(JSON.stringify(SC.map), 'ghosttown-map-' + SC.map.name, '.json', SC.cmd.show);
};

SC.map.findPlace = function (aPlace, aMap) {
    // find place on any map
    aPlace = aPlace.toLowerCase();
    //console.info('SC.map.findPlace("', aPlace, '", "', aMap, '")');
    // all maps using .place, non-cached because some maps are not loaded!
    var k, p;
    for (k in SC.maps) {
        if (SC.maps.hasOwnProperty(k)) {
            if (aMap && (aMap.name !== k)) {
                continue;
            }
            for (p in SC.maps[k].place) {
                if (SC.maps[k].place.hasOwnProperty(p)) {
                    if (SC.maps[k].place[p] === aPlace) {
                        console.info('SC.map.findPlace', aPlace, SC.maps[k].name);
                        return { x: SC.map.getXY(p, 0), y: SC.map.getXY(p, 1), map: SC.maps[k].name };
                    }
                }
            }
        }
    }
};

SC.map.eraseAll = function () {
    // erase all maps from storage so that they will be reloaded from disk
    var m;
    for (m in SC.maps) {
        if (SC.maps.hasOwnProperty(m)) {
            SC.storage.erase('SC.map.' + m);
        }
    }
    SC.player.load();
    SC.renderSafeKey = '';
    SC.renderSafe();
};

SC.map.upgrade = function () {
    // test if new version of this map available, if so tell user about it
    if (!SC.map.modified && (SC.map.version !== SC.maps[SC.map.name].version)) {
        console.log('SC.map.upgrade FORCED');
        SC.storage.erase('SC.map.' + SC.map.name);
        SC.player.load();
        SC.renderSafeKey = '';
        SC.renderSafe();
        // NOTE: I planed to do fancy upgrade that would preserve user changes
        // but that is pretty much impossible
        // // 1. replace layers (ground only?)
        // SC.map.ground = SC.maps[SC.map.name].ground;
        // // 2. upgrade npc (except x, y, tile, characters)
        // // 3. forced refresh
        // SC.renderSafeKey = '';
        // SC.renderSafe();
    } else {
        console.log('SC.map.upgrade - not necessary');
    }
};

SC.map.constraint = function (aPoint) {
    // keep point.x, point.y within map
    var changed = false;
    if (aPoint.x < 0) {
        aPoint.x = 0;
        changed = true;
    }
    if (aPoint.y < 0) {
        aPoint.y = 0;
        changed = true;
    }
    if (aPoint.x > SC.map.width - 1) {
        aPoint.x = SC.map.width - 1;
        changed = true;
    }
    if (aPoint.y > SC.map.height - 1) {
        aPoint.y = SC.map.height - 1;
        changed = true;
    }
    if (changed) {
        console.info('SC.map.constraint', aPoint.y, SC.map.height);
        SC.player.bubble('Out of map');
        throw "This happens when user walk out of map via console command";
    }
    return changed;
};

