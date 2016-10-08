点击穿透的解决办法，自定义模拟事件：

```js
/**
 * 快速点击
 * @jmingzi
 */
+function () {
  var touch = {};
  var t = new Date().getTime();
  document.addEventListener('click', function (event) {
    if (event.myclick == true) {
      return true;
    }
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else {
      event.propagationStopped = true;
    }
    event.stopPropagation();
    event.preventDefault();
    return true;
  }, true);

  document.addEventListener('touchstart', function (e) {
    touch.startTime = e.timeStamp;
    touch.el = e.target;
    touch.startClientX = e.changedTouches[0].clientX;
    t = e.timeStamp;
  });
  document.addEventListener('touchmove', function (e) { });
  document.addEventListener('touchend', function (e) {
    // 判断点击的是同一个点，否则就认为不是点击
    if (touch.startClientX == e.changedTouches[0].clientX) {
      touch.last = e.timeStamp;
      var event = document.createEvent('Events');
      event.initEvent('click', true, true, window, 1, e.changedTouches[0].screenX, e.changedTouches[0].screenY,         e.changedTouches[0].clientX, e.changedTouches[0].clientY, false, false, false, false, 0, null);
      event.myclick = true;
      touch.el && touch.el.dispatchEvent(event);
      return true;
    }
  });
}();
```

再一种办法是增加一个透明的层，300ms后移除，其实也是一个完美的解决办法
 
```js
avoidClickThrouth: function () {
  var mask = $('<div style="position:fixed;width:100%;height:100%;background-color:transparent;top:0;"></div>');
  $('body').append(mask);
  window.setTimeout(function () {
    $(mask).remove();
  }, 300);
}
```
