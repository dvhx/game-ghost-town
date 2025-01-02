// Helper object for creating common types of newspaper articles, basically a dom builder
"use strict";
// globals: document, window, setTimeout, setInterval

var SC = window.SC || {}

SC.articles = function () {
    var self = {};
    self.recent = null;

    // main element
    self.main = document.createElement('div');
    self.main.style.flex = 1;
    self.main.style.width = '100%';
    self.main.style.height = '100%';
    self.main.style.overflowY = 'scroll';
    self.main.style.boxSizing = 'border-box';

    self.element = function (aType, aTextContent) {
        // create single element of given type, add it to main
        var e = document.createElement(aType);
        self.main.appendChild(e);
        if (aTextContent) {
            e.textContent = aTextContent;
        }
        self.recent = e;
        return e;
    };

    self.title = function (aTitle) {
        // basic title
        return self.element('h3', aTitle);
    };

    self.text = function (aText) {
        // paragraph of text
        return self.element('p', aText);
    };

    self.issue = function (aDate) {
        // issuing date
        return self.element('h2', SC.newspaperDate(aDate));
    };

    self.header = function (aSubtitle) {
        // header with capitalized subtitles
        return self.element('nav', aSubtitle);
    };

    self.paging = function (aPage, aPageCallback) {
        // header with < Page 3 >
        var e = self.element('nav'), b1, b2, pg;
        e.style.display = 'flex';

        // previous page
        b1 = document.createElement('a');
        b1.textContent = '<';
        b1.style.flex = 1;
        b1.style.webkitUserSelect = 'none';
        b1.style.opacity = aPage > 0 ? 1 : 0.3;
        b1.onclick = function () {
            aPage--;
            if (aPage < 0) {
                aPage = 0;
            }
            aPageCallback(aPage);
        };
        e.appendChild(b1);

        // current page
        pg = document.createElement('span');
        pg.textContent = 'Page #' + (aPage + 1);
        pg.style.flex = 1;
        e.appendChild(pg);

        // next page
        b2 = document.createElement('a');
        b2.textContent = '>';
        b2.style.flex = 1;
        b2.style.webkitUserSelect = 'none';
        b2.onclick = function () {
            aPage++;
            aPageCallback(aPage);
        };
        e.appendChild(b2);

        return e;
    };

    self.textarea = function (aText, aFullSize, aPlaceholder) {
        // text in textarea preserves eol
        var e = self.element('textarea');
        e.value = aText;
        e.style.width = '100%';
        e.style.display = 'block';
        if (aFullSize) {
            e.style.height = '100%';
            e.style.flex = '1';
            e.style.resize = 'none';
            self.main.style.overflowY = 'hidden';
        } else {
            e.style.height = '5em';
        }
        e.style.display = 'block';
        e.style.boxSizing = 'border-box';
        e.placeholder = aPlaceholder;
        return e;
    };

    self.list = function (aItems, aOrdered, aBlank, aTitle) {
        // list
        if (!aItems || (aItems.length <= 0)) {
            return;
        }
        if (aTitle) {
            self.title(aTitle);
        }
        var e = self.element(aOrdered ? 'ol' : 'ul'), li, i, a;
        if (aBlank) {
            e.style.listStyle = 'none';
            e.style.marginLeft = 0;
            e.style.paddingLeft = 0;
        }
        for (i = 0; i < aItems.length; i++) {
            li = document.createElement('li');
            if (aItems[i].match(/^http/)) {
                // link in list
                a = document.createElement('a');
                a.href = aItems[i];
                a.textContent = aItems[i];
                li.appendChild(a);
                li.style.listStyle = 'none';
            } else {
                if (aItems[i].charAt(0) === '!') {
                    // item starting with ! will have no bullet
                    li.textContent = aItems[i].substr(1);
                    li.style.listStyle = 'none';
                } else {
                    // normal item
                    li.textContent = aItems[i];
                }
            }
            e.appendChild(li);
        }
        return e;
    };

    self.ul = function (aItems, aTitle) {
        // unordered list with optional title
        return self.list(aItems, false, false, aTitle);
    };

    self.ol = function (aItems, aTitle) {
        // ordered list with optional title
        return self.list(aItems, true, false, aTitle);
    };

    self.bl = function (aItems, aTitle) {
        // blank list with optional title
        return self.list(aItems, false, true, aTitle);
    };

    self.commands = function (aItems, aTitle) {
        // list of commands with title
        return self.list(aItems, false, true, aTitle || 'Commands');
    };

    self.examples = function (aItems) {
        // list of examples with title
        return self.list(aItems, false, true, 'Examples');
    };

    self.synopsis = function (aItems) {
        // list of synopsis with title
        return self.list(aItems, false, true, 'Synopsis');
    };

    self.tile = function (aTiles, aText) {
        // tile with description
        var e = self.element('p'), canvas;
        canvas = SC.standAloneTile(e, aTiles);
        canvas.style.float = 'left';
        e.appendChild(document.createTextNode(aText));
        return e;
    };

    self.comment = function (aNick, aText) {
        // nick: comment
        var e, nick, comment;
        e = self.element('div');
        if (aNick) {
            nick = document.createElement('span');
            nick.textContent = aNick + ': ';
            nick.style.fontWeight = 'bold';
            e.appendChild(nick);
        }
        comment = document.createElement('span');
        comment.textContent = aText;
        e.appendChild(comment);
        return e;
    };

    self.blink = function (aText) {
        // show info displayed in blink
        var e = self.element('div', aText);
        e.style.borderRadius = '3px';
        e.style.display = 'inline-block';
        e.style.backgroundColor = '#ffa';
        e.style.boxShadow = '0 0 0.5ex black';
        e.style.padding = '0.5ex';
        e.style.borderBottomLeftRadius = '1ex';
        e.style.borderBottomRightRadius = '1ex';
        e.style.margin = '0.5ex';
        return e;
    };

    self.price = function (aPrice) {
        // show price in gold
        var e;
        e = document.createElement('div');
        e.className = 'price';
        e.textContent = aPrice + ' gold';
        if (self.recent.nodeName === 'P') {
            // if recently added element was paragraph add it there instead of main
            self.recent.appendChild(e);
        } else {
            self.main.appendChild(e);
            self.recent = e;
        }
        return e;
    };

    self.date = function (aDate) {
        // show date in human readable form
        var e;
        e = self.element('div');
        e.textContent = SC.date.human(aDate);
        e.className = 'date';
        return e;
    };

    self.line = function (aThick) {
        // line separating article
        var e = self.element('hr');
        if (aThick) {
            e.className = 'thick';
        }
        return e;
    };

    self.br = function () {
        // empty line
        return self.element('br');
    };

    self.clearFix = function () {
        // add clearfix
        var e = self.element('div');
        e.className = 'clear';
        return e;
    };

    self.button = function (aLabel, aCallback, aData) {
        // button
        var e = self.element('button');
        e.textContent = aLabel;
        e.data = aData;
        if (typeof aCallback === 'string') {
            e.addEventListener('click', function () {
                SC.cmd.run(aCallback);
            });
        } else {
            e.addEventListener('click', aCallback);
        }
        return e;
    };

    self.character = function (aBase) {
        // character choosing button (for intro)
        var e = SC.standAloneTile(self.main, [aBase + '-down']);
        e.addEventListener('click', function () {
            SC.cmd.run('#player base ' + aBase + ' #player save');
            if (SC.currentIntro) {
                SC.currentIntro.close();
            }
        });
        return e;
    };

    self.link = function (aUrl, aLabel) {
        // hyperlink
        var e = self.element('a');
        e.href = aUrl;
        e.textContent = aLabel || aUrl;
        e.style.display = 'block';
        e.style.marginBottom = '1ex';
        e.style.marginLeft = '2ex';
        return e;
    };

    self.inventory = function (aTiles, aText, aPrice, aAmount) {
        // single inventory item
        var e, g = Array.isArray(aTiles) ? aTiles.toString() : aTiles;
        if (!SC.goods.hasOwnProperty(g)) {
            console.error('article.inventory - unknown goods: ', aTiles, aText, aPrice, aAmount);
            return;
        }
        if (SC.goods[g].edible) {
            self.button('Eat', '#inventory hide #delay 300 #inventory eat ' + g);
        }
        if (SC.goods[g].drop) {
            self.button('Drop', '#inventory hide #delay 300 #inventory drop ' + g);
        }
        e = self.tile(Array.isArray(aTiles) ? aTiles : [aTiles], aText + ' (you have ' + aAmount + ')');
        self.price(aPrice);
        self.line();
        return e;
    };

    return self;
};

