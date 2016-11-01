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
    var originWidth = docEl.getBoundingClientRect().width;

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
        var scaleWidth = docEl.getBoundingClientRect().width;
        scaleWidth = originWidth > 540 ? 540*dpr : scaleWidth;
        docEl.style.fontSize = scaleWidth / 10 + 'px';
        
        // 部分手机，例如三星note2
        // 缩放前和缩放后的宽度是不变的，但是dpr却变化了，导致字体放大了而屏幕没有缩小
        if (scaleWidth == originWidth) {
            docEl.setAttribute('data-dpr', 1);
            // 这部分代码其实冗余
            scale = 1;
            metaEl.setAttribute('content', 'width=device-width,initial-scale='+ scale +', maximum-scale='+ scale +', minimum-scale='+ scale +', user-scalable=no');
        }
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
