- 移动端字体设置   

> 移动端设置字体的前提是对`meta`标签`viewport`的设置，即：

```html
<meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
```

再设置字体。
```js
var dpi = window.devicePixelRatio;
var clientWidth = "";
var t = null;
var fontsize = document.body.clientWidth / 10;

if (dpi != 1) {
  var obj = document.head.getElementsByTagName("meta")[2];
  var n = 1 / dpi;
  obj.content = "width=device-width,initial-scale="+n+", maximum-scale="+n+", minimum-scale="+n+", user-scalable=no";
}

t = window.setInterval(function () {
  clientWidth = document.body.clientWidth;
  if (clientWidth != 0) {
    clearInterval(t);
    fontsize = clientWidth / 10;
    document.documentElement.style.fontSize = fontsize + 'px';
  }
}, 10);
```

- 移动端表情替换：
```javascript 
function utf16toEntities(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0); // 取出高位
            L = char.charCodeAt(1); // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
} 
```
- 移动端输入法替换emoji表情字符
```js
var re = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
```

- 兼容性好的滚轮事件，[张鑫旭](http://www.zhangxinxu.com/wordpress/2013/04/js-mousewheel-dommousescroll-event/)

```js
/* 
  自定义兼容的滚轮事件方法 
*/
var addEvent = (function(window, undefined) {        
  var _eventCompat = function(event) {
      var type = event.type;
      if (type == 'DOMMouseScroll' || type == 'mousewheel') {
          event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
      }
      //alert(event.delta);
      if (event.srcElement && !event.target) {
          event.target = event.srcElement;    
      }
      if (!event.preventDefault && event.returnValue !== undefined) {
          event.preventDefault = function() {
              event.returnValue = false;
          };
      }
      return event;
  };
  if (window.addEventListener) {
      return function(el, type, fn, capture) {
          if (type === "mousewheel" && document.mozHidden !== undefined) {
              type = "DOMMouseScroll";
          }
          el.addEventListener(type, function(event) {
              fn.call(this, _eventCompat(event));
          }, capture || false);
      }
  } else if (window.attachEvent) {
      return function(el, type, fn, capture) {
          el.attachEvent("on" + type, function(event) {
              event = event || window.event;
              fn.call(el, _eventCompat(event));    
          });
      }
  }
  return function() {};    
})(window);        

addEvent(document, "mousewheel", function(event) {
  // if (event.delta < 0) { alert("鼠标向上滚了！"); }
  return false;
});
```
- 自定义事件委托
```js
/*
    事件委托
  */
  var eventBind = function (type, dom, fn) {
    document.body.addEventListener(type, function (event) {
      var domObj = null;
      event = event || window.event;
      domObj = AlertBox.$(dom);
      if (event.target && event.target.id === domObj.id) {
        event.stopPropagation();
        fn(event.target);        
      }
    }, false);
  };

  eventBind('click', '#confirms-cancel', function (ev) {
    AlertBox.hide(ev.parentNode.parentNode.parentNode);
  });
```
