// Dummy Android object so that non-android apps won't crash trying calling it
// require: assert,cookie,flash,import,import2,metrics,param,spinner,splash,storage
"use strict";
// globals: Android, window, document, setTimeout, localStorage

var Android = {
    isReal: function () { return !true; },
    loadUrl: function (aUrl) { document.location = aUrl; },
    reload: function () { document.location.reload(); },
    setShared: function (aData) {
        localStorage.setItem('Android.shared', aData);
    },
    getShared: function () {
        return localStorage.getItem('Android.shared');
    },
    setData: function (aData) {
        localStorage.setItem('Android.data', aData);
    },
    getData: function () {
        return localStorage.getItem('Android.data');
    },
    showToast: function (aMessage) {
        // Show small piece of text at the bottom of screen
        var div, toast;
        div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.bottom = '1cm';
        div.style.left = '1cm';
        div.style.right = '1cm';
        div.style.bottom = '1cm';
        div.style.zIndex = 111;
        div.style.textAlign = 'center';
        toast = document.createElement('div');
        toast.textContent = aMessage;
        toast.style.display = 'inline-block';
        toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
        toast.style.color = 'white';
        toast.style.padding = '1ex';
        toast.style.borderRadius = '2ex';
        document.body.appendChild(div);
        setTimeout(function () {
            div.parentElement.removeChild(div);
        }, 5000);
        div.appendChild(toast);
    }
};
