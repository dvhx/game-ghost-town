// Show confirm dialog at the top of window with buttons
// This is replacement for confirm() function which is not supported in chrome packaged apps
// require: none
"use strict";

var SC = window.SC || {};

SC.confirm = function (aMessage, aButtons, aCallback) {
    // Show messages at the top of window with buttons
    var self = {}, i, btn;

    self.div = document.createElement('div');
    self.div.className = 'dh_confirm';
    if (typeof aMessage === 'string') {
        self.div.appendChild(document.createTextNode(aMessage));
    } else {
        self.div.appendChild(aMessage);
    }
    self.div.style.position = 'fixed';
    self.div.style.top = '0px';
    self.div.style.left = '0px';
    //self.div.style.bottom = '0px';
    self.div.style.width = '100%';
    self.div.style.border = '1px solid red';
    self.div.style.boxSizing = 'border-box';
    self.div.style.textAlign = 'center';
    self.div.style.padding = '1em';
    self.div.style.backgroundColor = '#f77';
    self.div.style.fontSize = '16px';
    self.div.style.color = 'black';
    self.div.style.zIndex = 109;

    function onClick(event) {
        // click on button
        self.hide();
        if (aCallback) {
            aCallback(event.target.textContent);
        }
    }

    // buttons
    self.buttons = [];
    for (i = 0; i < aButtons.length; i++) {
        btn = document.createElement('button');
        btn.addEventListener('click', onClick);
        btn.textContent = aButtons[i];
        btn.style.marginLeft = '1ex';
        self.div.appendChild(btn);
        self.buttons.push(btn);
    }

    document.body.appendChild(self.div);

    self.hide = function () {
        // hide this alert message
        self.div.parentNode.removeChild(self.div);
    };

    return self;
};

