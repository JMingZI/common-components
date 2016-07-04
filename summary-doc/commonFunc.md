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

对于一个h5上含有表格内容的文件，应如处理表格大小何展现内容：
首先必不可少的
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=5.0,user-scalable=1"/>
```

```js
window.onload = function() {   
  try{ 
    var screenWidth = document.body.clientWidth - 20    
      , bodyChilds = document.getElementsByTagName('table')
      ;

    if (bodyChilds && bodyChilds.length > 0) {        
      var temp = null, dpi = 0;        
      var getWidth = function (obj) {
          return parseInt(obj.currentStyle? obj.currentStyle.width : window.getComputedStyle(obj, null).width);        
      }; 
      var getHeight = function (obj) {
          return parseInt(obj.currentStyle? obj.currentStyle.height : window.getComputedStyle(obj, null).height);        
      }; 
      var siblingElem = function(elem){
        var _nodes = []
            ,_elem = elem
        ;
        // while ((elem = elem.previousSibling)){
        //     if(elem.nodeType === 1){
        //         _nodes.push(elem);
        //         break;
        //     }
        // }
        // elem = _elem;
        while ((elem = elem.nextSibling)){
            if(elem.nodeType === 1){
                _nodes.push(elem);
                break;
            }
        }
        return _nodes;
      }
      var tableOffsetTop = [], top = 0, H = 0;
      for(var i = 0; i<bodyChilds.length; i++) { 
        if(bodyChilds[i].parentNode.nodeName != "TD" && (getWidth(bodyChilds[i]) > screenWidth)) {
          dpi = screenWidth / getWidth(bodyChilds[i]);
          if (i == 0) {
            top = bodyChilds[i].offsetTop;
            H = bodyChilds[i].offsetTop*(1-dpi);
          }
          else
            top = bodyChilds[i].offsetTop*dpi;
          tableOffsetTop.push(top);
        }
      }
      for(var i = 0; i<bodyChilds.length; i++) { 
        temp = bodyChilds[i];           
        if (temp.parentNode.nodeName != "TD" && (getWidth(temp) > screenWidth)) {
          dpi = screenWidth / getWidth(temp);
          // 设置缩小后的父层高度
          temp.parentNode.style.height = getHeight(temp.parentNode) - getHeight(temp) + getHeight(temp)*dpi + "px";
          // 缩小
          temp.style.transform = "scale(" + dpi + ")";
          // 向左的边距
          temp.style.marginLeft = - (getWidth(temp) - screenWidth)/2 + "px";

          // 
          // if (i == 0){
            temp.style.marginTop = - getHeight(temp)*(1 - dpi) / 2 + "px";
            // if (siblingElem(temp)[0].nodeName == "TABLE") {
              // temp.style.marginBottom = - getHeight(temp)*(1 - dpi) / 2 + (- getHeight(bodyChilds[i+1])*(1 - dpi) / 2) + "px";
            // } else {
              temp.style.marginBottom = - getHeight(temp)*(1 - dpi) / 2  + "px";
            // }
          // }else{
            // temp.style.marginTop = - getHeight(temp)*(1 - dpi) / 2 + "px";
            // temp.style.marginBottom = - getHeight(temp)*(1 - dpi) / 2  + "px";
            // temp.style.marginTop = - getHeight(temp)*(1 - dpi) / 2 + tableOffsetTop[i] + H + "px";
          //   temp.style.marginBottom = - getHeight(temp)*(1 - dpi) / 2 + tableOffsetTop[i] + H + "px";
          // }
        }       
      }        
    }
  }catch(e){};
};
```
