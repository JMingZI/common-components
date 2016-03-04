# jquery.alertBox
PC端公用弹层

1、初始化及参数：
```js
$('.mask').alertBox({
  type: "ALERT" // 默认是ALERT，可选MODAL
  msg: "这是提示",
  title: "标题",
  closeWarning: "关闭弹窗会清空内容！确定关闭？",
  callback: function () {
    console.log(1);
  },
  modalMinWidth : "",  // 弹框最小宽度
  modalBodyMinHeight: "", // 弹框body的最小高度
  modalHeight: ""， // 弹框高度 ，设置后，弹框body的最小高度失效
  maskcolor: "", // 弹框遮罩的颜色
});
```

