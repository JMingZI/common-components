/* ========================================================================
 * AlertBox: modal v1.0.0
 * http://
 * ========================================================================
 * Copyright 2016 Jmingzi, Inc.
 * 2016-03-03
 * ======================================================================== */
;(function(root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.AlertBox = factory();
  }

  var alertbox = {};
  function Plugin(options) {
    alertbox = new AlertBox(options, this.selector);
    return alertbox;
  }

  // BIND EVENT TO BTNS ONCE!!!
  // ==========================

  var targetClick = null;  
  $(document).on("click", ".ym-close, .modal-close", function (event) {
    var maskNode = $(this).parent().parent().parent();

    if (maskNode.attr('data-name') != alertbox.defaultSetting.name) {
    // modal 
      var warning = maskNode.attr('data-warning');
      var closeCallback = maskNode.attr('data-closeCallback');

      if (warning && closeCallback) {
        $(alertbox.maskSelector).alertBox({
          type: "confirm",
          msg: warning,
          title: "提示",
          confirmCallback: closeCallback
        });
      } else alertbox._hide(maskNode);
    } else alertbox._hide(maskNode);
    
    targetClick = this;
  });

  // click confirm btn-confirm 
  $(document).on("click", "#modal-confirm", function (event) {
    var maskNode = $(this).parent().parent().parent();
    var parentModal = targetClick ? $(targetClick).parent().parent().parent() : null;

    if (typeof alertbox.options.confirmCallback == "string" 
    && typeof eval(alertbox.options.confirmCallback) == "function" 
    || typeof alertbox.options.confirmCallback == "function") {
      if (maskNode.attr('data-name') === "mask") {
        if (typeof alertbox.options.confirmCallback == "function") 
          alertbox.options.confirmCallback();
        else eval(alertbox.options.confirmCallback)();
      }
      if(parentModal) alertbox._hide(parentModal);
      alertbox._hide(maskNode);
    }else {
      alertbox._hide(maskNode);
      return false;
    }
  });

  // INIT PLUGIN ALERTBOX
  // ====================

  $.fn.alertBox = Plugin;

})(this, function () {
  'use strict';

  // ADD STYLE
  // ==========

  var scripts = document.scripts, stylePath = "";
  $.each(scripts, function(i, el) {
    if (scripts[i].src.indexOf('alertbox') > 0) {
      stylePath = scripts[i].src.substring(0, scripts[i].src.lastIndexOf("/") + 1) + '/style/stylesheets/index.css';
      return false;
    }
  });
  $('<link/>', {rel: "stylesheet", href: stylePath}).appendTo($('head'));
  
  // SET ALERTBOX OBJECT
  // =================== 

  var AlertBox = function (options, maskSelector) {
    this.maskSelector = maskSelector;

    if (!this.check(options)) return false;

    this.elements = (function (alertbox) {
      return {
        modal  : alertbox.MASK.find('.ym-modal'),
        head   : alertbox.MASK.find('.head'),
        foot   : alertbox.MASK.find('.foot'),
        title  : alertbox.MASK.find('.title'),
        body   : alertbox.MASK.find('.body'),
        close  : alertbox.MASK.find('.modal-close'),
        confirm: alertbox.MASK.find('.modal-confirm'),
      }; 
    }(this));
    
    this._set();
  };

  AlertBox.prototype.defaultSetting = {
    type              : "alert", // type alert or confirm or modal
    name              : "mask",
    width             : '400px',
    height            : '200px',
    msg               : "",
    maskcolor         : true,
    confirmCallback   : "null",
    closeWarning      : "",
    closeCallback     : "null",
    title             : "提示",
    zIndex            : 0,
    modalTop          : false
  };

  AlertBox.prototype._reset = function () {
    this.elements.modal.css({'width': this.options.width, 'height': this.options.height});
    this.elements.body.html("");
    this.elements.title.text(this.options.title);
    this.elements.close[0].style.display = "inline";
    this.elements.confirm.removeClass('ym-close');
    this.elements.confirm.removeAttr('id');
  }

  AlertBox.prototype._set = function() {
    var msgHtml = "";
    this.elements.title.text(this.options.title);

    if (!this.options.maskcolor) {
      this.MASK.css({"background-color": "transparent", "filter": "none"})  
    } else {
      this.MASK.css({"background-color": "", "filter": ""});
    }

    if (this.options.zIndex !== 0) { 
      this.MASK[0].style.zIndex = this.options.zIndex; 
    }

    if (this.options.type !== "modal") {
    // alert confirm  
      this._reset();
      msgHtml = this.options.msg;
      this.elements.body.html(msgHtml);

      if (this.options.type == "alert") {
        this.elements.close[0].style.display = "none";
        this.elements.confirm.addClass('ym-close');
        this.elements.confirm.removeAttr('id');
      } else this.elements.confirm.attr('id', "modal-confirm");
    } else {
    // modal  
      if (this.options.closeWarning != "") this.MASK.attr('data-warning', this.options.closeWarning);
      if (typeof this.options.closeCallback == "string" && this.options.closeCallback != "null")
         this.MASK.attr('data-closeCallback', this.options.closeCallback);
    }

    this._show(this.MASK);
    this._setSize();
  }

  AlertBox.prototype._setSize = function () {
    var modalWidth  = 0
      , modalHeight = 0
      ;
    if (this.options.width) this.elements.modal.css("width", this.options.width);

    if (this.options.height) {
        this.elements.modal.css("height", this.options.height);
        this.elements.body.css("height", parseInt(this.options.height) - this.elements.head.outerHeight() - 
        this.elements.foot.height() + "px");
    }

    modalWidth = this.elements.modal.width();
    modalHeight = this.elements.modal.height();
    if (this.options.name == "mask" && this.options.modalTop !== false) this.elements.modal.css({"margin-left": -modalWidth/2+"px", "top": this.options.modalTop});
    else this.elements.modal.css({"margin-left": -modalWidth/2+"px", "margin-top": -modalHeight/2+"px"});
  }

  AlertBox.prototype.check = function (options) {
    var modalObj = null;

    // CHECK OPTIONS
    if (typeof options === "string") {
      this.defaultSetting.msg = options;
      this.options = this.defaultSetting;

    } else if (typeof options === "object") {
      this.options = $.extend({}, this.defaultSetting, options);

    } else { 
      alert("options must be a string or json object!");
      return false; 

    }

    // CHECK TYPE
    if ('alert,modal,confirm'.indexOf(this.options.type) < 0) {
       alert("modal type is one of alert,modal,confirm!");
       return false; 

    }

    // CHECK NAME
    if (this.options.name == "" || typeof this.options.name != "string") {
      alert("modal name is require or is not string");
      return false; 

    }

    // CHECK MASK
    modalObj = $(document).find(this.maskSelector + '[data-name="'+this.options.name+'"]');
    if (modalObj.length === 0) {
       alert("modal data-name is not match width your arguments-name!");
       return false; 
    } 

    if (modalObj.length === 1) { 
      this.MASK = modalObj;

    } else if (modalObj.length > 1) {
      this.MASK = $(modalObj[0]);

    }

    if (this.options.type !== "modal") { 
    // alert confirm
      if (this.MASK.attr('data-name') !== "mask") {
         alert("alert or confirm data-name must be mask!");
         return false;
      }
    } else {
    // modal  
      if (this.options.closeCallback != "null" && typeof eval(this.options.closeCallback) != "function") {
        alert("modal closeCallback must be a function"); 
        return false;
      }
    }

    // CHECK MASKCOLOR
    if (typeof this.options.maskcolor != "boolean") {
       alert("modal maskcolor mast be a boolean!");
       return false; 
    }

    // CHECK Z-INDEX
    if (typeof this.options.zIndex !== "number") {
       alert("modal zIndex mast be a number!");
       return false; 
    }
    
    return true;
  };

  AlertBox.prototype._isIEandVersion = function () {
      var userAgent = navigator.userAgent
        , b_version = navigator.appVersion.split(";")
        , trim_Version = b_version[1].replace(/[ ]/g,"")
        ;
      if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) {
          return parseInt(trim_Version.substr(4, trim_Version.length));
      } else {
          return false;
      }
  };

  AlertBox.prototype._setBackground = function () {
    var IE = this._isIEandVersion()
      , opacity = 0;
      
    if(!IE || IE >= 9)
       this.MASK.css("background-color", this.options.maskcolor);
    else {
       opacity = this.options.maskcolor.substr(this.options.maskcolor.lastIndexOf(",")+1, this.options.maskcolor.length);
       opacity = opacity.substr(0, opacity.length-1);
       opacity = (Number(opacity)*255).toString(16).substr(0, 2);
       this.MASK.css({"filter": "progid:DXImageTransform.Microsoft.gradient(startColorstr=#" + opacity + "000000,endColorstr=#" + opacity + "000000)"});
    }
  }

  AlertBox.prototype._hide = function (obj) {
    obj[0].style.display = "none";
    if ($('body').height() > $(window).height()) {
        var maskIsAllHide = true;
        var maskNode = $('body').find(this.maskSelector);
      if (maskNode.length >= 2) {
        maskNode.each(function(index, el) {
          if (this.style.display === "block") maskIsAllHide = false;     
        });
      }
      if (maskIsAllHide) $('body').css('overflow', '');
    }
  }

  AlertBox.prototype._show =  function (obj) {
    obj[0].style.display = "block";
    
    if ($('body').height() > $(window).height()) {
        $('body').css('overflow', 'hidden');
    }
  }

  return AlertBox;
});
