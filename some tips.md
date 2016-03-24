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


