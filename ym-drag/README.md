### 自定义拖拽功能

功能需求：从初试位置拖动到目标位置，在目标位置可以拖拽改变顺序。

使用：
 - 引入drag.scss
 - 引入jquery
 - 引入drag.js

1、初始化 
```js
YmDrag.init({
  dragFromBox: $('.ym-drag-from'),  //  拖动目标初始容器
  dragToBox: $('.ym-drag-to'),      //  目标容器  
  dragCompleteCallback: function (dragObj) { 
    // 拖拽完成的回调函数
    // @params dragObj 拖动的jquery对象
  }
});
```
2、说明：

可拖动目标的className必须包含`ym-drag-item`，必须添加如下属性格式，例如：
```html
<div class="ym-drag-from">
    <div class="ym-drag-item" data-componentname="ym-component-date"></div>
    <div class="ym-drag-item" data-componentname="ym-component-img"></div>
</div>
```

  

