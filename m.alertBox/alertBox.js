/*
 @name 自定义移动端弹层

  // Also can be used to seajs like this
  ======================================

  define(function(require, module, exports){
    
    ...

    module.exports = AlertBox;
  });
*/
+function (window) {

  function AlertBox (cfg) {
    var _ = this;
    _.cfg = cfg;
    _.showTimer = null;  
    _.el = { body: _.$('body')[0] };
    _.init();
  }
  AlertBox.prototype = {
    init: function () {
      if (this.cfg) {
        this.cfg.debug = this.cfg.debug 
                       ? this.cfg.debug : false;
        this.cfg.alertBoxKeepTime = this.cfg.alertBoxKeepTime 
                       ? this.cfg.alertBoxKeepTime : 500;
        this.cfg.promptMaxlength = this.cfg.promptMaxlength 
                       ? this.cfg.promptMaxlength : 20;
      } 
    },
    /*
      普通弹窗
      @param 弹层显示的字符
      @param 弹层消失后的跳转地址，可为空。
    */
    alerts: function (str) {
      var _ = this;
      var alerts = this.$('.alerts')[0];
      var msg = null;

      if (alerts) {
        msg = alerts.childNodes[0];
        msg.innerText = str;
      } else {
        _.createAlertBox(str);
        alerts = this.$('.alerts')[0];
      }
      _.show(alerts, true);
    },
    /*
      带回调函数的警告框
      @param 弹层显示的字符
      @param 弹窗标题，默认为提示
    */
    confirms: function (str, title) {
      var _ = this;

      var confirms = this.$('.confirms')[0];
      if (confirms) {
        _.resetConfirms();
        var msg = this.$('.msg')[0].getElementsByTagName('p')[0];
        msg.innerText = str;
      } else {
        _.createConfirmBox(str, title);
        confirms = this.$('.confirms')[0];
      }
      _.show(confirms, false);

      if (_.cfg.debug || _.isiOS()) confirms.classList.add('iOS');
      else confirms.classList.remove('iOS');
    },
    /*
      输入文本的弹层，带回调函数
      @param 输入文本的placeholder
      @param 弹窗标题，默认为提示
    */
    prompts: function (placeholderStr, title) {
      var _ = this;
      var prompts = this.$('.prompts')[0];
      if (prompts) {
        _.resetConfirms();
        _.changeConfirmToPrompt(placeholderStr, title);
      } else {
        _.changeConfirmToPrompt(placeholderStr, title);
        prompts = this.$('.prompts')[0];
      } 
      _.show(prompts, false);

      if (_.cfg.debug || _.isiOS()) prompts.classList.add('iOS');
      else prompts.classList.remove('iOS');
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
      判断是不是iOS，
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

      if (text) obj.innerText = text;
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
    createConfirmBox: function (str, title) {
          title = (title && title != "") ? title : "提示"; 
      var confirms = this.createElClass("confirms");
      var confirmBox = this.createElClass("confirms-box");
      var msg = this.createElClass("msg");
      var confirmBtns = this.createElClass("confirms-btns");
      var title = this.createElClass("title", title);
      var p = document.createElement("p");
          p.appendChild(document.createTextNode(str));
      var cancel = document.createElement("a");
          cancel.href = "javascript:;";
          cancel.className = "confirms-btn confirms-cancel";
          cancel.id = "confirms-cancel";
          cancel.appendChild(document.createTextNode("取消"));
      var confirm = document.createElement("a");
          confirm.href = "javascript:;";
          confirm.className = "confirms-btn confirms-confirm";
          confirm.id = "confirms-confirm";
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
      if (textarea) msg.removeChild(textarea);
    },
    /*
      在警告框的基础上
      修改节点为文本输入框
    */
    changeConfirmToPrompt: function (placeholderStr, title) {
      var confirms = this.$('.confirms')[0];
      if (!confirms) {
        this.createConfirmBox(placeholderStr, title);
        confirms = this.$('.confirms')[0];
      } else {
        this.$('.title')[0].innerHTML = title;
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
    show: function (showNode, isAutoHide) {
      var _ = this;
      showNode.style.display = "block";
      document.body.style.overflow = "hidden";

      if (!$(showNode).hasClass('alertFadeIn')) {
        showNode.classList.add("alertFadeIn");
        showNode.classList.remove("alertFadeOut");
      }

      if (isAutoHide) {
        if (_.showTimer) clearTimeout(_.showTimer);
        _.showTimer = window.setTimeout(function () {
          showNode.classList.remove("alertFadeIn");
          showNode.classList.add("alertFadeOut");
          _.hide(showNode);
        }, _.cfg.alertBoxKeepTime);
      }
    },
    hide: function (hideNode) {
      hideNode.style.display = "none";
      document.body.style.overflow = "";
    }
  };

  var AlertBox = new AlertBox({
    debug: false, 
    alertBoxKeepTime: 1500,
    promptMaxlength: 20
  });

  /*
    事件委托
  */
  var eventBind = function (type, dom, fn) {
    document.body.addEventListener(type, function (event) {
      var domObj = null;
      event = event || window.event;
      domObj = AlertBox.$(dom);
      if (event.target && event.target.id === domObj.id) {
        event.stopPropagation();
        fn(event.target);        
      }
    }, false);
  };

  eventBind('click', '#confirms-cancel', function (ev) {
    AlertBox.hide(ev.parentNode.parentNode.parentNode);
  });

  window.AlertBox = AlertBox;
}(window);


