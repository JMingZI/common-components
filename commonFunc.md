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
  // 防止input输入框点击穿透
  avoidClickThrouth: function () {
    var mask = $('<div style="position:fixed;width:100%;height:100%;background-color:transparent;top:0;"></div>');
    $('body').append(mask);
    window.setTimeout(function () {
      $(mask).remove();
    }, 300);
  },
  // getComputedWidth
  getComputedWidth: function (obj) {
    return parseInt(obj.currentStyle? obj.currentStyle.width : window.getComputedStyle(obj, null).width);        
  }; 
};
```

常见正则匹配

- 姓名
```js
/^(_)(_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name);
```

- 手机号
```js
/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(data.mobile);
```

- 邮箱
```js
/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(data.applicantMail);
```

- 验证码
```js
/^\d{4}$/.test(data.mobileAuthCode);
```
