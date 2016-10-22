【置顶】React滑动分页实现：[SlidePage.js](SlideMove.js)

详细例子请见`test.html` 

移动端滑动判断：

```js
var slideDirection = {
        /*
         * @angle number>0，用来衡量向左向右的角度
         * @callback function，滚动正确的回调
        */
        init: function (angle, callback) {
            this.setAngle = angle;
            //滑动处理
            var startX, startY, me = this;
            document.addEventListener('touchstart', function (ev) {
                startX = ev.touches[0].pageX;
                startY = ev.touches[0].pageY;   
            }, false);
            document.addEventListener('touchend', function (ev) {
                var endX, endY;
                endX = ev.changedTouches[0].pageX;
                endY = ev.changedTouches[0].pageY;

                var direction = me.GetSlideDirection(startX, startY, endX, endY);
                callback && callback(direction);
            }, false);
        },
        //返回角度
        GetSlideAngle: function(dx, dy) {
            return Math.atan2(dy, dx) * 180 / Math.PI;
        },
        //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
        GetSlideDirection: function(startX, startY, endX, endY) {
            var dy = startY - endY;
            var dx = endX - startX;
            var result = 0;
         
            //如果滑动距离太短
            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                return result;
            }
         
            var angle = this.GetSlideAngle(dx, dy);
            if (angle >= -this.setAngle && angle < this.setAngle) {
                result = 4;
            } else if (angle >= this.setAngle && angle < (180 - this.setAngle) ) {
                result = 1;
            } else if (angle >= -(this.setAngle + 180) && angle < -this.setAngle) {
                result = 2;
            }
            else if ((angle >= (180 - this.setAngle) && angle <= 180) || (angle >= -180 && angle < -(180 - this.setAngle))) {
                result = 3;
            }
         
            return result;
        }
    };
```
初始化

```js
slideDirection.init(options.angle, function (data) { 
    if (data == 1) { // 向上
        windowHeightScrollTop = $(window).height() + document.body.scrollTop;  
        // 页面滚动到底部
        (document.body.offsetHeight <= windowHeightScrollTop) && options.callback();
        imgLazyload();
    }
});
```


web端 兼容性好的滚轮事件，[张鑫旭](http://www.zhangxinxu.com/wordpress/2013/04/js-mousewheel-dommousescroll-event/)

```js
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


