  "use strict";
  /*
   * @ 移动端自定义弹出层
   * @功能
   *   1、普通弹窗 @params 提示字符窜，跳转url（可选）
   *   2、警告框   @params 提示字符窜，点击确定后的回调函数（可选）   
   *   3、prompt   @params 文本输入placeholder，点击确定后的回调函数（可选）  
   * @环境：iOS调用原生弹窗，其它调用自定义
   * @初始化 
   *   var AlertBox = new AlertBox(
   *             {
   *                 debug: false, //开启后，在iOS中也调用自定义弹窗
   *                 alertBoxKeepTime: 500, //普通弹窗显示时间
   *                 animationDuration: 300, //弹窗动画经历时间
   *                 promptMaxlength: 30 //prompt文本输入的最大长度
   *             }
   *        );
   *
   * @authur JmingZI
   * @date 2016-2-29
  */
  function AlertBox (cfg) {
    var _ = this;
    _.cfg = cfg;  
    _.el = {
      body: _.$('body')[0],
    };
    _.init();
  }

  AlertBox.prototype = {
    init: function () {
      if (this.cfg) {
        this.cfg.debug = this.cfg.debug 
                       ? this.cfg.debug : false;
        this.cfg.alertBoxKeepTime = this.cfg.alertBoxKeepTime 
                       ? this.cfg.alertBoxKeepTime : 500;
        this.cfg.animationDuration = this.cfg.animationDuration 
                       ? this.cfg.animationDuration : 300;
        this.cfg.promptMaxlength = this.cfg.promptMaxlength 
                       ? this.cfg.promptMaxlength : 30;
      } 
    },
    /*
      普通弹窗
      @param 弹层显示的字符
      @param 弹层消失后的跳转地址，可为空。
    */
    alerts: function (str, url) {
      var _ = this;

      if (_.cfg.debug || _.isiOS()) {
        alert(str);
      } else {
        var alerts = this.$('.alerts')[0];
        if (this.el.body.contains(alerts)) {
          var msg = alerts.childNodes[0];
          msg.innerText = str;
        } else {
          _.createAlertBox(str);
          alerts = this.$('.alerts')[0];
        }
        _.show(alerts);
      }

      window.setTimeout(function () {
        _.hide(alerts, url);
      }, _.cfg.alertBoxKeepTime);
    },
    /*
      带回调函数的警告框
      @param 弹层显示的字符
      @param 点击确定后的回调函数，可不填
    */
    confirms: function (str, callback) {
      var _ = this;

      if (_.cfg.debug || _.isiOS()) {
        if (confirm(str)) {
          callback();
        }
      } else {
        var confirms = this.$('.confirms')[0];
        if (this.el.body.contains(confirms)) {
          _.resetConfirms();
          var msg = this.$('.msg')[0].getElementsByTagName('p')[0];
          msg.innerText = str;
        } else {
          _.createConfirmBox(str);
          confirms = this.$('.confirms')[0];
        }
        _.show(confirms);
        _.bindBtnEvent(callback);
      }
    },
    /*
      输入文本的弹层，带回调函数
      @param 输入文本的placeholder
      @param 点击确定后的回调函数，可不填
    */
    prompts: function (placeholderStr, callback) {
      var _ = this;

      if (_.cfg.debug || _.isiOS()) {
        if (prompt(placeholderStr)) {
          if (typeof callback == 'function') {
            callback();
          }
        }
      } else {
        var prompts = this.$('.prompts')[0];

        if (!this.el.body.contains(prompts)) {
          _.changeConfirmToPrompt(placeholderStr);
          prompts = this.$('.prompts')[0];
        }
        _.show(prompts);
        _.bindBtnEvent(callback);
      }
    },
    /*
      自定义获取节点函数
    */
    $: function (node) {
      var nodeFirstWord = node.substr(0, 1);
      var nodeOtherWords = node.substr(1, node.length);

      if (nodeFirstWord == "#") {
        return document.getElementById(nodeOtherWords);
      } else if (nodeFirstWord == ".") {
        return document.getElementsByClassName(nodeOtherWords);
      } else {
        return document.querySelectorAll(node);
      }
    },
    /*
      判断是不是iOS，是iOS，调用系统的，否则其它的用自定义
    */
    isiOS: function () {
      var u = navigator.userAgent
        , isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

      return isiOS;
    },
    /*
      创建DIV，并命名类名
      此函数可扩展
    */
    createElClass: function (myclass, text) {
      var obj = document.createElement("div");
          obj.className = myclass;

      if (text) {
        obj.innerText = text;
      }
      return obj;
    },
    /*
      创建普通弹窗
      并添加到body子节点
    */
    createAlertBox: function (str) {
      var alertBox = this.createElClass("alerts");
      var alertBoxMsg = this.createElClass("alert-msg");
          alertBoxMsg.innerText = str;
          alertBox.appendChild(alertBoxMsg);

      this.el.body.appendChild(alertBox);
    },
    /*
      创建警告框
      并添加到body子节点
    */
    createConfirmBox: function (str) {
      var confirms = this.createElClass("confirms");
      var confirmBox = this.createElClass("confirms-box");
      var msg = this.createElClass("msg");
      var confirmBtns = this.createElClass("confirms-btns");
      var title = this.createElClass("title", "提示：");
      var p = document.createElement("p");
          p.appendChild(document.createTextNode(str));
      var cancel = document.createElement("a");
          cancel.href = "javascript:;";
          cancel.className = "confirms-btn confirms-cancel";
          cancel.appendChild(document.createTextNode("取消"));
      var confirm = document.createElement("a");
          confirm.href = "javascript:;";
          confirm.className = "confirms-btn confirms-confirm";
          confirm.appendChild(document.createTextNode("确定"));

      msg.appendChild(title);
      msg.appendChild(p);

      confirmBtns.appendChild(cancel);
      confirmBtns.appendChild(confirm);

      confirmBox.appendChild(msg);
      confirmBox.appendChild(confirmBtns);

      confirms.appendChild(confirmBox);
      this.el.body.appendChild(confirms);
    },
    /*
      重置文本输入框
      还原成警告框的节点
    */
    resetConfirms: function () {
      var confirms = this.$('.confirms')[0];
          confirms.classList.remove("prompts");
      var msg = this.$('.msg')[0];
          msg.getElementsByTagName('p')[0].style.display = "block";
      var textarea = document.getElementById('confirms-prompt');
      if (textarea) {
        msg.removeChild(textarea);
      }
    },
    /*
      在警告框的基础上
      修改节点为文本输入框
    */
    changeConfirmToPrompt: function (placeholderStr) {
      var confirms = this.$('.confirms')[0];
      if (!confirms) {
        this.createConfirmBox();
        confirms = this.$('.confirms')[0];
      }
      confirms.classList.add("prompts");
      //移除p
      var msg = this.$('.msg')[0];
          msg.getElementsByTagName('p')[0].style.display = "none";
      var textarea = document.createElement('textarea');
          textarea.id = "confirms-prompt";
          textarea.placeholder = placeholderStr;
          textarea.setAttribute("maxlength", this.cfg.promptMaxlength);
      msg.appendChild(textarea);
    },
    /*
      节点显示函数
    */
    show: function (obj) {
      obj.style.display = "block";
      obj.classList.remove("alertFadeOut");
      obj.classList.add("alertFadeIn");
    },
    /*
      节点隐藏函数
      @param 节点对象
      @param 普通弹层需要跳转的url，可为空
    */
    hide: function (obj, url) {
      var _ = this;
      obj.classList.remove("alertFadeIn");
      obj.classList.add("alertFadeOut");

      window.setTimeout(function () {
        obj.style.display = "none";

        if (url && typeof url === "string") {
          window.location.href = url;
        }
      }, _.cfg.animationDuration);
    },
    /*
      绑定弹层按钮
    */
    bindBtnEvent: function (callback) {
      var _ = this;
      //弹窗关闭事件
      _.$('.confirms')[0].addEventListener("click", function (event) {
        _.hide(_.$('.confirms')[0]);
      }, false);

      // 确定事件
      _.$('.confirms-confirm')[0].addEventListener("click", function (event) {
        if (typeof callback == 'function') {
          callback();
        }
      }, false);

      // prompt输入
      var prompt = document.getElementById('confirms-prompt');
      if (prompt) {
        prompt.addEventListener('click', function (event) {
          event.stopPropagation()
        }, false);
      }
    }
  };
