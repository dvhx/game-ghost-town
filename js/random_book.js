// Procedural magic book generator
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.twister = function (aSeed) {
    // simple pseudo random generator with string seed, e.g. "White magic"
    var self = {}, buffer = '', hash = aSeed, counter = 0;

    function more() {
        if (buffer.length < 32) {
            counter++;
            hash = SC.sha1(hash.toString() + counter.toString());
            buffer += hash;
            //console.log('more: buffer', buffer, 'hash', hash, 'counter', counter);
        }
    }

    self.randomInt = function (aMin, aMax) {
        // get one integer within range
        var range = aMax - aMin,
            bytes = range < 65535 ? 4 : 8,
            x,
            i;
        more();
        // get few bytes from buffer
        x = buffer.substr(0, bytes);
        buffer = buffer.substr(bytes);
        // convert it to in with given range
        i = parseInt(x, 16);
        //console.log('x', x, 'bytes', bytes, 'buffer', buffer, 'i', i, 'range', range);
        return aMin + i % (range + 1);
    };

    self.randomWord = function (aWords) {
        // return random word
        var r = self.randomInt(0, aWords.length - 1);
        return aWords[r];
    };

    return self;
};

SC.magicBook = function (aTitle, aSpells) {
    // generate magic book with given title and spells
    var main, h1, p, pc, par, i, s, sc, sentences = [], close, twister = SC.twister(aTitle), canvas, canvases = [],
        alphabet = ["do", "re", "mi", "fa", "so", "la", "si", "do", "nar", "fir", "bar", "zer", "ga", "di", "ze", "fan"];

    SC.cmd.hideKeyboard();

    // main div
    main = document.createElement('div');
    main.style.backgroundColor = 'white';
    main.style.display = 'block';
    main.style.position = 'fixed';
    main.style.left = '0';
    main.style.right = '0';
    main.style.top = '0';
    main.style.bottom = '0';
    main.style.overflowY = 'scroll';
    main.style.fontFamily = 'KlaberFraktur';
    main.style.color = '#1e0d0d';
    main.style.backgroundColor = '#f6efe2';
    main.style.padding = '1ex';
    main.style.fontSize = 'xx-large';
    main.style.textAlign = 'justify';

    function hide() {
        // hide book
        main.parentElement.removeChild(main);
        SC.cmd.show();
    }
    main.addEventListener('dblclick', hide, true);

    function sentence(aMin, aMax) {
        // generate single sentence
        var a, b, aa, bb, sy = [], wo = [], wor;
        aa = twister.randomInt(aMin, aMax);
        for (a = 1; a <= aa; a++) {
            // few sylables in word
            sy = [];
            bb = twister.randomInt(1, 3);
            for (b = 1; b <= bb; b++) {
                sy.push(alphabet[twister.randomInt(0, alphabet.length - 1)]);
            }
            wor = sy.join('');
            // first letter capital in sentence
            if (a === 1) {
                wor = wor.charAt(0).toUpperCase() + wor.substr(1);
            }
            wo.push(wor);
        }
        return wo.join(' ');
    }

    // title
    h1 = document.createElement('h1');
    h1.textContent = sentence(aTitle.split(' ').length, aTitle.split(' ').length);
    h1.style.padding = '0';
    h1.style.margin = '0';
    h1.style.fontSize = 'xx-large';
    h1.style.fontWeight = 'normal';
    main.appendChild(h1);

    // close button
    close = document.createElement('button');
    close.textContent = 'x';
    close.onclick = hide;
    close.style.float = 'right';
    close.style.minWidth = '1.1cm';
    close.style.minHeight = '1.1cm';
    close.style.backgroundColor = 'transparent';
    close.style.border = 0;
    close.style.outline = 0;
    h1.appendChild(close);

    function cast(event) {
        // cast spell when user click on canvas with transmutation circle
        hide();
        console.info('Casting spell', event.target.dataSpell);
        SC.cmd.run('#delay 300 #bubble "' + event.target.dataSpell + '" #delay 500 ' + event.target.dataSpell);
    }

    // all spells
    for (i = 0; i < aSpells.length; i++) {
        // few paragraphs before spell
        pc = twister.randomInt(3, 7);
        for (p = 1; p <= pc; p++) {
            // few sentences per paragraph
            sentences = [];
            sc = twister.randomInt(1, 5);
            for (s = 1; s <= sc; s++) {
                sentences.push(sentence(4, 8));
            }
            par = document.createElement('p');
            par.textContent = sentences.join('. ') + '.';
            main.appendChild(par);
        }

        // spell image
        canvas = document.createElement('canvas');
        canvases.push(canvas);
        canvas.style.width = '90vw';
        canvas.style.height = '90vw';
        canvas.style.margin = 'auto';
        canvas.dataSpell = aSpells[i];
        canvas.onclick = cast;
        main.appendChild(canvas);
        p = document.createElement('div');
        p.textContent = aSpells[i];
        p.style.textAlign = 'center';
        p.dataSpell = aSpells[i];
        p.onclick = cast;
        main.appendChild(p);
    }

    document.body.appendChild(main);

    // render transmutations circles
    for (i = 0; i < canvases.length; i++) {
        SC.transmutation(canvases[i], aSpells[i]);
    }

    return { html: main, canvases: canvases };
};

