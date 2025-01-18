// Code for viewing images in gallery
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {};

SC.galleryOpen = false;

SC.gallery = function (aUrl, aTitle, aAuthor, aCallback) {
    // show one image in gallery

    // prevent multiple galleries opening
    if (SC.galleryOpen) {
        return false;
    }
    SC.galleryOpen = true;

    var div, figure, img, figcaption, title, author, te = SC.touch.enabled, hide, esc;
    SC.touch.enabled = false;

    // closing gallery with esc
    function onKeyDown(event) {
        if (event.keyCode === 27) {
            event.preventDefault();
            hide();
        }
    }
    window.addEventListener('keydown', onKeyDown, true);

    hide = function () {
        // close gallery
        window.removeEventListener('keydown', onKeyDown, true);
        div.parentElement.removeChild(div);
        SC.touch.enabled = te;
        SC.galleryOpen = false;
        if (aCallback) {
            aCallback();
        }
    };

    // background
    div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.left = '0';
    div.style.right = '0';
    div.style.top = '0';
    div.style.bottom = '0';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.backgroundImage = 'url(image/brick.png)';
    div.addEventListener('click', hide);

    // esc
    if (!Android.isReal()) {
        esc = document.createElement('div');
        esc.style.margin = '0';
        esc.style.padding = '0.5ex';
        esc.style.position = 'absolute';
        esc.style.top = '1em';
        esc.style.background = 'rgba(0,0,0,0.3)';
        esc.style.borderRadius = '0.5ex';
        esc.style.color = 'white';
        esc.textContent = 'Press ESC to exit';
        div.appendChild(esc);
    }

    // figure
    figure = document.createElement('figure');
    figure.style.margin = '0';
    figure.style.padding = '0';
    div.appendChild(figure);

    // image
    img = document.createElement('img');
    img.src = aUrl;
    img.style.border = '1ex solid white';
    img.style.boxShadow = '1ex 1ex 1ex rgba(0,0,0,0.3)';
    img.style.minWidth = '220px';
    img.style.minHeight = '200px';
    img.style.maxWidth = '300px';
    img.style.maxHeight = '200px';
    img.style.backgroundColor = 'white';
    figure.appendChild(img);

    // caption
    figcaption = document.createElement('figcaption');
    figcaption.style.color = 'black';
    figcaption.style.backgroundColor = 'white';
    figcaption.style.display = 'block';
    figcaption.style.margin = 'auto';
    figcaption.style.maxWidth = '50%';
    figcaption.style.fontFamily = 'sans-serif';
    figcaption.style.fontSize = 'small';
    figcaption.style.textAlign = 'center';
    figcaption.style.borderRadius = '0.5ex';
    figcaption.style.whiteSpace = 'nowrap';
    figcaption.style.marginTop = '1em';
    figcaption.style.boxShadow = '0.3ex 0.3ex 0.3ex rgba(0,0,0,0.3)';
    figure.appendChild(figcaption);

    // title
    title = document.createElement('div');
    title.innerText = aTitle.replace(/_/g, ' ');
    title.style.fontWeight = 'bold';
    figcaption.appendChild(title);

    // author
    author = document.createElement('div');
    author.innerText = aAuthor.replace(/_/g, ' ');
    figcaption.appendChild(author);

    // show
    document.body.appendChild(div);
    return div;
};

