// Display fullscreen iframe with the look of old newspaper (used for many things in game, inventory, shop, history, etc...)
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {}

SC.newspaperDate = function (aDate) {
    // Return date as "Wednesday May 4th"
    var weekday, month, suffix, d, dd, dayOfMonth;
    weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    suffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th',
        'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th',
        'th', 'st'];
    d = aDate ? new Date(aDate) : new Date();
    dd = d.getDate();
    dayOfMonth = dd + suffix[dd];
    return weekday[d.getDay()] + ' ' + month[d.getMonth()] + ' ' + dayOfMonth;
};

SC.newspaperFromData = function (aTitle, aArticles, aOnClose) {
    // display articles as old newspaper
    var main, h1, button, onEsc;

    main = document.createElement('div');
    main.className = "newspaper";
    main.style.margin = '0';
    main.style.padding = '1ex';
    main.style.position = 'fixed';
    main.style.left = '0';
    main.style.top = '0';
    main.style.right = '0';
    main.style.bottom = '0';
    main.style.display = 'flex';
    main.style.flexDirection = 'column';
    //main.style.overflowY = 'initial';

    function close() {
        console.log('Closing newspaper');
        if (main && main.parentElement) {
            main.parentElement.removeChild(main);
        }
        window.removeEventListener('keydown', onEsc, true);
        if (Android.isReal()) {
            SC.cmd.show();
        }
        if (aOnClose) {
            aOnClose();
        }
        console.log('SC.inInput=' + SC.inInput);
    }

    // doubleclick on newspaper close it (this was causing problems in shop)
    //main.addEventListener('dblclick', close);

    // button to close newspaper
    button = document.createElement('button');
    button.className = 'closeButton';
    button.textContent = 'X';
    button.addEventListener('click', close);
    main.appendChild(button);

    // closing info with esc
    onEsc = function (event) {
        if (event.keyCode === 27) {
            event.preventDefault();
            close();
        }
    };
    window.addEventListener('keydown', onEsc, true);

    // heading
    h1 = document.createElement('h1');
    h1.textContent = aTitle;
    main.appendChild(h1);

    // articles
    main.appendChild(aArticles);
    aArticles.style.flex = 1;

    // show
    document.body.appendChild(main);
    SC.cmd.hideKeyboard();
    return { main: main, close: close };
};

SC.newspaperFromRaw = function (aTitle, aData) {
    // Show raw data in textarea in newspaper
    var e, n;
    e = document.createElement('textarea');
    e.style.marginTop = '0ex';
    e.style.display = 'block';
    e.style.boxSizing = 'border-box';
    e.style.width = '100%';
    e.style.height = '100%';
    e.style.resize = 'none';
    e.value = aData;
    n = SC.newspaperFromData(aTitle, e);
    n.main.style.overflowY = 'initial';
    return n;
};

SC.newspaperFromUrl = function (aTitle, aUrl) {
    // show newspaper from url
    var e, n;
    e = document.createElement('iframe');
    e.style.marginTop = '0ex';
    e.style.display = 'block';
    e.style.boxSizing = 'border-box';
    e.style.border = '0px solid red';
    e.style.width = '100%';
    e.style.height = '100%';
    //e.onload = function () { console.info('iframe onload ' + event.target.src); };
    e.src = aUrl;
    n = SC.newspaperFromData(aTitle, e);
    n.main.style.overflowY = 'initial';
};

