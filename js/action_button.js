// Action button that appear on the screen when some action is available
"use strict";
// globals: document, window, setTimeout, setInterval

var SC = window.SC || {}

SC.actionButtonOld = null;

SC.actionButton = function (aAction, aDetail, aCallback, aTop, aReplacePrevious, aWithoutNo) {
    // show action button
    // SC.actionButton('Do', 'something', function (a, d) { console.info('callback', a, d); }, '50vh', true, false);
    var div, yes, no, act, det;

    // div
    div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = aTop || '1cm';
    div.style.minHeight = '1.3cm';
    div.style.backgroundColor = '#f99';
    div.style.borderTopRightRadius = '3mm';
    div.style.borderBottomRightRadius = '3mm';
    div.style.fontFamily = 'sans-serif';
    div.style.boxShadow = '1mm 1mm 3mm rgba(0,0,0,0.5)';
    div.style.maxWidth = '90vw';
    div.style.left = '-5cm';
    div.style.transition = 'left 0.2s';

    // yes
    yes = document.createElement('button');
    yes.style.minWidth = '1.5cm';
    yes.style.minHeight = '1.3cm';
    yes.style.display = 'block';
    yes.style.float = 'left';
    yes.style.border = '0';
    yes.style.borderTopRightRadius = '3mm';
    yes.style.borderBottomRightRadius = '3mm';
    yes.style.outline = 'none';
    yes.style.backgroundColor = 'skyblue';
    yes.style.textAlign = 'left';
    div.appendChild(yes);
    // click callback
    yes.addEventListener('click', function () {
        document.body.removeChild(div);
        SC.actionButtonOld = null;
        if (Android.isReal()) {
            SC.cmd.show();
        }
        aCallback(aAction, aDetail);
    });
    // action label
    act = document.createElement('div');
    act.textContent = aAction;
    act.style.fontWeight = 'bold';
    yes.appendChild(act);
    // detail label
    det = document.createElement('div');
    det.textContent = aDetail;
    yes.appendChild(det);

    // no
    if (!aWithoutNo) {
        no = document.createElement('button');
        no.textContent = 'X';
        no.style.minWidth = '1.5cm';
        no.style.minHeight = '1.3cm';
        no.style.display = 'block';
        no.style.float = 'left';
        no.style.border = '0';
        no.style.borderTopRightRadius = '3mm';
        no.style.borderBottomRightRadius = '3mm';
        no.style.outline = 'none';
        no.style.backgroundColor = 'transparent';
        // click callback
        no.addEventListener('click', function () {
            document.body.removeChild(div);
            SC.actionButtonOld = null;
            if (Android.isReal()) {
                SC.cmd.show();
            }
            SC.cmd.run('#lock off');
        });
        div.appendChild(no);
    }

    // hide previous
    if (aReplacePrevious) {
        if (SC.actionButtonOld) {
            document.body.removeChild(SC.actionButtonOld);
            SC.actionButtonOld = null;
        }
    }

    // show it
    document.body.appendChild(div);
    setTimeout(function () {    // Start css animation of moving action button to left
        div.style.left = '0';
    }, 100);
    SC.actionButtonOld = div;
    return div;
};

SC.actionButtonAutoHide = function (aActionButton) {
    // autohide button after some time
    setTimeout(function () {
        if (aActionButton && aActionButton.parentElement) {
            if (aActionButton.parentElement.contains(aActionButton)) {
                aActionButton.parentElement.removeChild(aActionButton);
                SC.actionButtonOld = null;
            }
        }
    }, 8000);
};

