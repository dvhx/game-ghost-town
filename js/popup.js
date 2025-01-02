// popup in browser action
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator, chrome

// if window is already open, use it
var t = null;
chrome.tabs.query(
    { url: 'chrome-extension://' + chrome.runtime.id + '/android.html'},
    function (aTabs) {
        console.log(aTabs);
        console.log(typeof aTabs);
        console.log(aTabs.length);
        //alert(aTabs.length);
        if (aTabs.length === 0) {
            // open new tab with reader
            chrome.tabs.create({url: 'android.html', active: true });
        } else {
            // activate tab with reader
            chrome.tabs.highlight({ tabs: aTabs[0].index }, function (aTab) { console.log('activated: ', aTab); });
        }
        // close popup itself
        window.close();
    }
);




