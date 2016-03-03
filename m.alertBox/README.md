# alertBox
移动端自定义弹出层，iOS调用原生弹窗，其它调用自定义

### 说明：
 
 @ 移动端自定义弹出层   
 
 @ 用法
 
 ```html
 <link rel="stylesheet" href="styles/stylesheets/alertbox.css">
 <script src="alertBox.js"></script>
 ```
 @ 说明：样式用的`sass`，单位用的rem，需设置根字体大小
 
 ```js
 var fontsize = document.body.clientWidth / 10;
 document.documentElement.style.fontSize = fontsize + "px";
 ```
 
 @ 功能   
 
   * 1、普通弹窗 `@params 提示字符窜，跳转url（可选）` 
   * 2、警告框   `@params 提示字符窜，点击确定后的回调函数（可选）`     
   * 3、prompt   `@params 文本输入placeholder，点击确定后的回调函数（可选）`      
      
@ 环境：iOS调用原生弹窗，其它调用自定义  
 
@ 初始化
 
 ```js
 var AlertBox = new AlertBox(
  {
    debug: false, //开启后，在iOS中也调用自定义弹窗
    alertBoxKeepTime: 500, //普通弹窗显示时间
    animationDuration: 300, //弹窗动画经历时间
    promptMaxlength: 30 //prompt文本输入的最大长度
  }
);
```
@例子：

1、普通弹窗不带链接
```js
AlertBox.alerts("222");
```

2、普通弹窗带链接
```js
AlertBox.alerts("222", "ymblog.net");
```
3、警告框带回调
```js
AlertBox.confirms("提示文字", function () {
  AlertBox.alerts("222");
});
```
4、prompt带回调
```js
AlertBox.confirms("placeholder文字", function () {
  AlertBox.alerts("222");
});
```

@ authur [JmingZI](http://ymblog.net)

@ date 2016-2-29
