// Export piece of data by downloading it
// require: assert, date, alert
// globals: Blob, document, URL, Android
"use strict";

var SC = window.SC || {};

SC.export = function (aData, aFilePrefix, aFileExtension, aCallback) {
    // export data to external file
    var blob = new Blob([aData], { type: "text/plain" }),
        a = document.createElement('a'),
        size = (blob.size > 1024 ? (blob.size / 1024).toFixed(0) + ' kB' : blob.size + ' bytes');
    a.href = URL.createObjectURL(blob);
    a.download = (aFilePrefix || 'export') + '-' + SC.date.normal(undefined, '-') + (aFileExtension || '.txt');
    if (typeof Android === 'object' && Android.isReal()) {
        Android.export(aData, a.download);
    } else {
        a.click();
        SC.alert(size + ' was exported to file "' + a.download + '" in your default download location', undefined, undefined, aCallback).green();
    }
    return { filename: a.download, filesize: blob.size };
};

SC.download = function (aUrl, aName) {
    // download url
    console.log('SC.download', aUrl, aName);
    var link = document.createElement("a");
    link.download = aName.match(/[a-zA-Z0-9_\-\ \.]/g).join('');
    link.href = aUrl.toString();
    link.click();
};

