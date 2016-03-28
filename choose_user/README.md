## 公共多企业选人选部门

1，初始化
  
```js
var choosePeople = null;
if (!choosePeople) {
  choosePeople = new People({
    // 存放选人html DOM节点的容器，也就是弹窗的body即可
    root  : $('.choose_user').find('.body'),      
    
    // 存放左侧部门容器
    dept  : $('.choose_user').find('.dept'),      
    
    // 存放右侧人员的容器
    people: $('.choose_user').find('.mright'),    
    
     // 点击选人后，添加到底部的容器
    box   : $('.choose_user').find('.userBox'),  
   // send  : $('.choose_user').find('.modal-confirm'),  // 确定按钮
   
    // 取消按钮
    cancel: $('.choose_user').find('.modal-close'),   
  });
} else {
  // 重置选人html DOM
  choosePeople.clearChooseBox();    
}

// 将界面中已选择的人带回到选人界面
choosePeople.setUserToBox();      
```
