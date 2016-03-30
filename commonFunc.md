全局函数

```js
var globalF = {
  substrs: function(str, num){
    return str.length > num ? str.substr(0, num)+'...' : str;
  },
  checkAndroidiOS: function(){
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    if( isAndroid )
      return "1";
    else
      return "0";
  },
  getAvatarWords: function(str){
    var name = str.replace(/）|\.|\)|\(|\?|\,|!|？|。|，/g, '');
    var length = name.length;
    if(length <= 2)
      return str;
    else
      return name.substr(length-2, length);
  },
  avoidClickThrouth: function () {
    var mask = $('<div style="position:fixed;width:100%;height:100%;background-color:transparent;top:0;"></div>');
    $('body').append(mask);
    window.setTimeout(function () {
      $(mask).remove();
    }, 300);
  }
};
```
