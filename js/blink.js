// Briefly display small notification on top of the screen (like Android.showToast)
"use strict";
// globals: document, window, setTimeout, setInterval

var SC = window.SC || {}

SC.blink = (function () {
    var self = {}, buffer = [], element, show, fade, counter = 0;

    show = function (aText, aReplace) {
        // if no arguments show counter (for debuging)
        counter++;
        if (!aText) {
            aText = counter;
            aReplace = true;
        }
        // if previous message is still visible append text to buffer and show it later
        if (element) {
            // quickly update text
            if (aReplace) {
                element.textContent = aText;
                element.style.opacity = 1;
                return;
            }

            if (element.textContent !== aText) {
                // do not add same color twice
                buffer.push(aText);
            } else {
                // instead of showing the same text shortly blink te text color
                element.style.color = 'transparent';
                element.style.opacity = 3;
                setTimeout(function () {    // Shortly change blink color to black
                    element.style.color = 'black';
                }, 100);
            }
            return;
        }

        // create element for message
        element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '50%';
        element.style.transform = 'translateX(-50%)';
        element.style.color = 'black';
        element.style.backgroundColor = '#ffa';
        element.style.padding = '0.5ex';
        element.style.borderBottomLeftRadius = '1ex';
        element.style.borderBottomRightRadius = '1ex';
        element.style.boxShadow = '0ex 0ex 1ex black';
        element.textContent = aText;
        element.style.opacity = 1;
        element.style.zIndex = 10;
        element.addEventListener('click', function () {
            SC.inventory.show(true);
        });
        document.body.appendChild(element);
        // start the fadeout
        setTimeout(fade, 5000); // Fade blink after some time
        // add blink to reread history
        SC.bubbles.history.push({blink: aText, time: new Date()});
    };
    self.show = show;

    fade = function () {
        // hide element
        if (!element) {
            return;
        }
        element.style.opacity = element.style.opacity - 0.05;
        if (element.style.opacity > 0.1) {
            setTimeout(fade, 50); // Gradual fading of blink
        } else {
            element.parentElement.removeChild(element);
            element = null;
            // show next message from buffer
            if (buffer.length > 0) {
                show(buffer.splice(0, 1));
            }
        }
    };

    return self;
}());

