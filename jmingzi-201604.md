## 阶段性总结 2016-04-22

@JmingZI

#### 一、前言
***

2015-07-20日星期一是我正式入职讯盟科技的第一天，加入这个大家庭，在此感谢当时在百忙之中抽空看我简历的傅姐，感谢第一轮面我的俊航，也感谢boss吴面我，真是荣幸。

我是我们公司的第一个前端，也是第一个实习生前端，说起来还会有的小小杀马特感呢！

其实自己那时候是很多方面都不知道的小白（包括现在也只是了解了些许，进步了些许），比如那时我还从未接触过H5，没用过`zepto`，不清楚模块化概念，只听说过`sea.js`，仅仅会用`jquery`，用这仅有的稻草搭上了大三暑期找实习的千军万马行列中。不了解前后端分离等代码耦合，只是了解`grunt`,`gulp`，并不清楚前端构建工具有哪些，也不知道自动化是啥意思，包括现在自己对这些概念都是理解不深刻的，但是我知道学习的方向就是那些，就是不断抽象代码，不断组件化，即使我现在还不会实现组件化，但是自己一直在向那个方向前进着！使前端变得用起来简单，看起来简单。另外，这就是目的？

由于要毕设返校，故列出一些自己所做的东西以及写法，以方便工作的交接以及互相的一个了解。那其实标题就算不上“阶段性总结”了~~

下面就用做的东西的分类来归类吧，列出来的基本就是前端方面我负责维护的：

| web前台类          |          web后台类 |             h5类 |
| :--------------- | :--------------- | :--------------- |
| 公司官网 |企业管理后台|审批h5|
|优办web端|优邮后台|优小助|
|优办彩云主页|审批后台|管理后台h5|
|优办彩云下载页|超级管理后台-优小助|公告h5|
|麻绳下载页|营销助手后台|优邮h5|
||老版报表后台(已弃用)|内部推荐h5|
||开放注册（管理后台部分）|了解更多FAQ页面（部分）|


#### 二、阐述项目

##### 1、技术总结

- web端（兼容到IE7）
   - 页面比较少的话（3-4个页面），js就直接拿来写了（用jquery），样式一直都是用的`SASS compass`，自己有总结出 [base.scss](https://github.com/JMingZI/customComponents/blob/master/commonBaseStyle/base.scss) ，详细可点击查看。
   - 页面比较多，分栏目的话，`fis3 + jquery + seajs + sass`，`fis3`我最近发现的问题比较多吧，如果静态文件写成相对路径后，那么`seajs`的映射路径是不会改写为相对路径的，有点心碎。再就是打包压缩文件名加hash后缀的话，css文件如果你是用sass生成的是不会加上hash后缀的，再就是seajs引用的文件加上hash后找不到？记得之前都是可以的，目前似乎遇到了这些问题，通过这些问题我发现，还是要向`webpack`靠拢！
   
- H5
  - 之前一直没有写过h5，一直以为h5就是网页的手机版，继上次写过的审批之后，我突然发现iOS端比android恶心几百倍，兼容太难做了，具体总结的几点下面列出！自己也有总结出 [base.scss](https://github.com/JMingZI/customComponents/blob/master/commonBaseStyle/_mbase.scss) ，详细可点击查看。
  - 复杂些的比如审批也是用的`fis3 + zepto + seajs + sass`
  - 对于单页面的h5，由于自己没有深入的学习`angularjs`或`vuejs`，还不能够写出来。目前正在学`vuejs`。

- js写法常用模式

  最常的写法就是声明一个对象，比如：
  ```js
  var Object = {
    values: value1,
    functions : function (){}
  };
  // 初始化
  Object.functions();
  ```
  如果是需要重复使用但是值又不一样的对象或方法
  ```js
  function Object(){
  
  }
  Object.prototype = {
  
  };
  // 初始化
  var object = new Object(params);
  ```
  再就是比如上面的对象有需要公用的方法或属性可以暴露出来，那么就这样写了
  ```js
  var Calculator = function (eq) {
    //这里可以声明私有成员
    var eqCtl = document.getElementById(eq);

    return {
        // 暴露公开的成员
        add: function (x, y) {
            var val = x + y;
            eqCtl.innerHTML = val;
        }
    };
  };
  ```
  有时候执行某些代码段避免声明的变量冲突就使用了闭包
  ```js
  (function () {
    // ... 所有的变量和function都在这里声明，并且作用域也只能在这个匿名闭包里
    // ...但是这里的代码依然可以访问外部全局的对象
  }());
  ```
  列出完整的模式
  ```js
  var blogModule = (function () {
    var my = {}, privateName = "jmingzi";

    function privateAddTopic(data) {
        // 这里是内部处理代码
    }

    my.Name = privateName;
    my.AddTopic = function (data) {
        privateAddTopic(data);
    };

    return my;
  } ());
  ```
  
- 命名规范 
  - html/css 都是a-b的形式
  - js 变量就是驼峰式的 aB
  - 对象形如 Ab

##### 2、具体项目

- 审批应用

   fis3操作命令：
   ```js
    // 第一步cmd到 vacate 目录
  fis3 release -d E:attance_approve\src\main\webapp -w
  
  // 部署到线上就多加了打包压缩等操作 live
  fis3 release live -d E:attance_approve\src\main\webapp -w
  
  // 具体的配置可以查看fis_conf.js
   ```
   
  目录结构：
 ```js
  ./app             //存放html页面
  ./lib             // 存放引用的库
  ./sea-module      // 存放页面的模块js
  ./styles          // 样式文件和图片
  common_config.js  // 公用配置，方法
  fis-conf.js       // 工具配置
  index.html        //入口页面
  ```

- 营销助手
也是用的和审批一样的工具和结构，唯一的区别就是没有用seajs。

- 企业管理后台是从俊航手中接手的，jquery+seajs当初就存在的结构，这也是我后来学了seajs的缘故，css，js代码写的有点乱，没有用sass；页面和后端没有分离，用的`freemarker`模版。到后面应该会重做，设计也会重新出稿吧。

- 开放注册在原来后台的基础上扩展的，没用任何工具，和原有的一样的结构。

##### 3、git项目地址

|项目名|git地址|分支|
| :------ | :------ |:---|
|管理后台|[manage-web](http://git.shinemo.com:7990/projects/CCOAV3/repos/manage-web/browse)|refactor|
|审批后台|[apps-manage-background](http://git.shinemo.com:7990/projects/CCOAV3/repos/apps-manage-background/browse)|master|
|审批h5|[attendance_approve](http://git.shinemo.com:7990/projects/CCOAV3/repos/attendance_approve/browse)|master|
|优邮后台|[umail_web](http://git.shinemo.com:7990/projects/UBANJAVASERVER/repos/umail_web/browse)|master|
|营销助手|[data-report](http://gitlab.shinemo.com/ub/data-report)|master|
|开放注册|[masheng-bops](http://gitlab.shinemo.com/masheng/masheng-bops)|master|
|静态资源存放一|[优小助/新手帮助/FAQ/下载页面等](http://gitlab.shinemo.com/ub/staticresource)|master|
|静态资源存放二|[公共库/日常文档](http://gitlab.shinemo.com/ub/resource)|master|


##### 4、总结的点，也可以[点击这里查看](https://github.com/JMingZI/customComponents)

- h5
  - 自定义h5弹窗，目前审批签到都是用的，项目地址：[公用弹窗](https://github.com/JMingZI/customComponents/tree/master/m.alertBox)
  - 接下来的h5会采用前后端分离的结构，静态资源都使用cdn吧，完全可以、一定要这样尝试了~
  
  - 关于点击穿透
  
    - 以为使用了`fastclick.js`就可以完美解决的，但事实上错了，在华为荣耀3c上还是有这个问题，后来查了很多资料，那就是自己模拟tap事件 
 
  ```js
/*
 * 快速点击
 * 目前还存在的一个问题就是：只要是moveEnd都会触发事件，而实际上应该是取消触发，
 * 没时间来解决，已经想到解决办法
*/
+function () {
  var touch = {};
  var t = new Date().getTime();
  document.addEventListener('click', function (event) {
    if (event.myclick == true) {
      return true;
    }
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else {
      event.propagationStopped = true;
    }
    event.stopPropagation();
    event.preventDefault();
    return true;
  }, true);

  document.addEventListener('touchstart', function (e) {
    touch.startTime = e.timeStamp;
    touch.el = e.target;
    touch.startClientX = e.changedTouches[0].clientX;
    t = e.timeStamp;
  });
  document.addEventListener('touchmove', function (e) { });
  document.addEventListener('touchend', function (e) {
    // 判断点击的是同一个点，否则就认为不是点击
    if (touch.startClientX == e.changedTouches[0].clientX) {
      touch.last = e.timeStamp;
      var event = document.createEvent('Events');
      event.initEvent('click', true, true, window, 1, e.changedTouches[0].screenX, e.changedTouches[0].screenY,         e.changedTouches[0].clientX, e.changedTouches[0].clientY, false, false, false, false, 0, null);
      event.myclick = true;
      touch.el && touch.el.dispatchEvent(event);
      return true;
    }
    });
  }();
  ```
  
 另外结合`fastclick.js`加上300ms遮罩可以完美解决这个问题
 ```js
 avoidClickThrouth: function () {
  var mask = $('<div style="position:fixed;width:100%;height:100%;background-color:transparent;top:0;"></div>');
  $('body').append(mask);
  window.setTimeout(function () {
    $(mask).remove();
  }, 300);
}
```

 - 移动端字体

   在iOS上是没有微软雅黑的，对于不同屏幕的响应变化，根字体设置等等。
   
  ```js
    var dpi = window.devicePixelRatio;
    var clientWidth = "";
    var t = null;
    var fontsize = document.body.clientWidth / 10;

   if (dpi != 1) {
    var obj = document.head.getElementsByTagName("meta")[2];
    var n = 1 / dpi;
     obj.content = "width=device-width,initial-scale="+n+", maximum-scale="+n+", minimum-    scale="+n+", user-scalable=no";
  }

  t = window.setInterval(function () {
  clientWidth = document.body.clientWidth;
  if (clientWidth != 0) {
    clearInterval(t);
    fontsize = clientWidth / 10; // 此处应谨慎，得到的值不是整数，从而计算rem不方便
    document.documentElement.style.fontSize = fontsize + 'px';
     }
    }, 10);
   ```

  - 移动端表情替换，都可以输入表情，其实输入输出的话也没什么，但有时你想过滤掉，就这样用吧
  
 ```js
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

  - 输入法替换emoji表情字符的话正则：`/[\uD800-\uDBFF][\uDC00-\uDFFF]/g`


 
- web端

  - 也自定义了弹层，多层复用，项目地址：[公用地址](https://github.com/JMingZI/customComponents/tree/master/jquery.alertBox)
