# jquery.alertBox
PC端公用弹层

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
      <span class="close">&times;</span>
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
  
  // 默认是ALERT，可选MODAL
  type: "ALERT" 
  
  msg: "这是提示",
  title: "弹窗标题",
  
  //关闭弹窗时的提示文字，默认是false
  closeWarning: "关闭弹窗会清空内容！确定关闭？",
  
  // 弹窗确定按钮的回调函数
  callback: function () {
    console.log(1);
  },
  
  // 弹框最小宽度，默认是400px
  modalMinWidth : "",  
  
  // 弹框body的最小高度，默认是100px
  modalBodyMinHeight: "", 
  
  // 弹框高度 ，设置后，弹框body的最小高度失效
  // 二者设置之一即可
  modalHeight: ""， 
  
  // 弹框遮罩的颜色
  maskcolor: "", 
});
```

4、例子

  最简单的弹窗：
  ```js
  $('.mask').alertBox("我是提示");
  ```
