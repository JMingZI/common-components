;(function (win) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');

    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'width=device-width,initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    // document data-dpr set font-size px
    var dpr = window.devicePixelRatio;
    if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
        dpr = 3;
    } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
        dpr = 2;
    } else {
        dpr = 1;
    }
    docEl.setAttribute('data-dpr', dpr);

    var scale = parseFloat((1 / dpr).toFixed(2));
    if (dpr != 1) {
        metaEl.setAttribute('content', 'width=device-width,initial-scale='+ scale +', maximum-scale='+ scale +', minimum-scale='+ scale +', user-scalable=no');
    }

    // document width
    function setDocumentFontSize () {
        var width = docEl.getBoundingClientRect().width;
        docEl.style.fontSize = width / 10 + 'px';
    }
    setDocumentFontSize();

    var timer;
    win.addEventListener('resize', function() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            setDocumentFontSize();
        }, 300);
    }, false);
})(window);