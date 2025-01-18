// Quests and their status
"use strict";
// globals: document, window
// require: storage, splash

var SC = window.SC || {};

SC.quests = (function () {
    // Quests and their status
    var self = {};
    self.quests = SC.storage.readObject('SC.quests.quests', {});

    self.callbackNewQuest = function (aKey, aTitle) {
        console.log('New quest available: ' + aKey + ' - ' + aTitle);
    };

    self.callback = function (aKey, aLimit, aValue, aLevel) {
        // Overwrite this to render "New quest available"
        console.warn('quests', aKey, aLimit, aValue, aLevel);
    };

    self.save = function () {
        // Save quests to storage
        SC.storage.writeObject('SC.quests.quests', self.quests);
    };

    self.add = function (aKey, aTitle, aPercent, aHidden, aWithoutSave) {
        // Add new quest
        if (!self.quests.hasOwnProperty(aKey)) {
            self.quests[aKey] = {title: aTitle, hidden: aHidden || false, percent: aPercent || 0, unseen: true};
            self.callbackNewQuest(aKey, aTitle);
            if (!aWithoutSave) {
                self.save();
            }
            return true;
        }
    };

    self.addAll = function (aKeyAndValues) {
        // Add multiple quests
        var k;
        for (k in aKeyAndValues) {
            if (aKeyAndValues.hasOwnProperty(k)) {
                self.add(k, aKeyAndValues[k].title, aKeyAndValues[k].percent, aKeyAndValues[k].hidden, true);
            }
        }
        self.save();
    };

    self.progress = function (aKey, aPercent) {
        // Update quest's progress
        if (self.quests.hasOwnProperty(aKey)) {
            self.quests[aKey].percent = aPercent;
            self.save();
        }
    };

    self.show = function () {
        // Show achievements

        function one(aParent, aTitle, aPercent, aHidden, aUnseen) {
            // Show one achievement
            var d, img, dtn, dtitle, dnext;

            // box
            d = document.createElement('div');
            d.style.border = '1px solid gray';
            d.style.boxShadow = '0.2ex 0.2ex 0.5ex rgba(0,0,0,0.5)';
            d.style.margin = '1ex';
            d.style.padding = '1ex';
            d.style.display = 'flex';
            d.style.alignItems = 'center';
            if (aPercent >= 100) {
                d.style.backgroundColor = 'white';
            } else {
                d.style.backgroundColor = 'gold';
            }
            if (aHidden) {
                d.style.backgroundColor = 'silver';
            }
            d.style.borderRadius = '1ex';
            if (aUnseen) {
                d.style.backgroundColor = 'lime';
            }

            // image
            img = document.createElement('div');
            img.textContent = aPercent >= 100 ? '✔' : '❌';
            img.style.width = '1.5cm';
            img.style.height = '1.5cm';
            img.style.fontSize = '1.5cm';
            img.style.margin = '0';
            img.style.padding = '0';
            img.style.textAlign = 'center';
            img.style.lineHeight = '100%';
            //img.style.marginRight = '1ex';
            d.appendChild(img);

            // text box
            dtn = document.createElement('div');
            dtn.style.marginLeft = '1ex';
            d.appendChild(dtn);

            // title
            dtitle = document.createElement('div');
            dtitle.textContent = aHidden ? '???' : aTitle;
            dtn.appendChild(dtitle);

            // progress
            dnext = document.createElement('div');
            dnext.style.opacity = 0.5;
            dnext.textContent = aHidden ? 'Finish previous quests first' : (aPercent.toFixed(0) + '% completed');
            dtn.appendChild(dnext);

            aParent.appendChild(d);
        }

        return SC.splash('Quests', [], '#bceabc', function (aContent) {
            var q, i, keys = Object.keys(self.quests);

            // move finished quests to the bottom?
            /*
            var f = [], u = [], uf = [];
            for (i = 0; i < keys.length; i++) {
                if (self.quests[keys[i]].percent >= 100) {
                    f.push(keys[i]);
                } else {
                    u.push(keys[i]);
                }
            }
            uf = u.concat(f);
            console.warn(u, f, uf);
            */

            // render quests
            for (i = 0; i < keys.length; i++) {
                q = keys[i];
                one(aContent, self.quests[q].title, self.quests[q].percent, self.quests[q].hidden, self.quests[q].unseen);
                if (self.quests[q].unseen) {
                    self.quests[q].unseen = false;
                    self.save();
                }
            }
        }, null, '80vw', '80vh');
    };

    return self;
}());


