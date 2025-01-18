// Show messages at the top of window, hide them after a while
// This is replacement for alert() which is not supported in packaged apps
// require: none
"use strict";

var SC = window.SC || {};

SC.dialogs = [];

// ESC will close most recent dialog (if it is open)
window.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('keyup', function (event) {
        if (event.keyCode === 27) {
            if (SC.dialogs.length > 0) {
                SC.dialogs.pop().hide();
                event.preventDefault();
            }
        }
    }, true);
});

SC.alert = function (aMessage, aHidePreviousAlerts, aNeverHide, aCallback) {
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

    self.hide = function (event) {
        // hide this alert message
        if (event) {
            event.preventDefault();
        }
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
    self.div.style.zIndex = 110;

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
