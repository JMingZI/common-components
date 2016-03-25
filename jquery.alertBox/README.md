# jquery.alertBox
web端公用弹层，依赖jquery。css使用的`SASS compass`

#### 使用介绍

1、引入
  ```html
  <script type="text/javascript" src="../scripts/jquery.alertbox.js"></script>  
  <link rel="stylesheet" href="../styles/stylesheets/alertBox.css">
  ```

2、引入DOM结构
```html
<!-- modal -->
<div class="mask">
  <div class="modal">
    <div class="head">
      <h4 class="title"></h4>
      <span class="close"></span>
    </div>
    <div class="body"></div>
    <div class="foot">
      <a href="javascript:;" class="modal-btns modal-close">关闭</a>
      <a href="javascript:;" class="modal-btns modal-confirm">确定</a>
    </div>  
  </div>
</div>
```

3、初始化及参数：
```js
$('.mask').alertBox({
  
  // 默认是alert，可选confirm，modal
  type: "alert" 
  
  msg: "这是提示",
  title: "弹窗标题",
  
  //关闭弹窗时的提示文字，默认是false
  closeWarning: "关闭弹窗会清空内容！确定关闭？",
  
  // 弹框宽度，默认是400px
  width : "400px",  
  
  // 弹框高度，默认是200px
  height: "200px", 
  
  // 弹框遮罩的颜色，默认rgba(0, 0, 0, 0.5)
  maskcolor: "rgba(0, 0, 0, 0.5)"
});
```

4、说明：

 - alert普通弹窗只有一个关闭按钮，普通的消息提示；
 - confirm也只是消息提示窗，但有确定按钮的回调；
 - modal则可以自定义modal-body的内容

5、例子

  最简单的弹窗：
  ```js
  $('.mask').alertBox("我是提示");
  ```
  
  confirm弹窗
  
  ```js
  $('.alert3').click(function(event) {
    $('.mask').alertBox({
      type: "confirm",
      msg: "这是提示",
      title: "你妹",
      width: "500px",
      height: "200px",
      closeWarning: "关闭弹窗会清空内容！确定关闭？"
    });
  });
  ```
