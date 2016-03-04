/* ========================================================================
 * AlertBox: modal v1.0.0
 * http://
 * ========================================================================
 * Copyright 2016 Jmingzi, Inc.
 * 2016-03-03
 * ======================================================================== */

+function ($) {
  'use strict';

  // SET ALERTBOX OBJECT
  // =================== 

  var AlertBox = function (obj, options) {
    this.MASK     = obj;
    this.elements = this._getEl();
    this.options  = this._init(options);
                    this._set();
  };

  AlertBox.prototype.defaultSetting = {
    type              : "ALERT", // type ALERT or MODAL
    modalMinWidth     : '',
    modalHeight       : '',
    modalBodyMinHeight: '',
    msg               : "",
    maskcolor         : true,
    callback          : null,
    closeWarning      : false,
    title             : "提示"    
  };

  // INIT SETTINGS AND STYLES
  // ========================

  AlertBox.prototype._init = function (options) {
    // set title
    if (options.title) this.elements.title.text(options.title);
    else this.elements.title.text(this.defaultSetting.title);
      
    if (typeof options == "string"){ this.defaultSetting.msg = options;return this.defaultSetting; }
    else if (typeof options == "object") { 
      // mask bg color
      if (options.maskcolor == false) this.MASK.css("background-color", "transparent");
      else if (options.maskcolor && typeof options.maskcolor == "string") {
        this.MASK.css("background-color", options.maskcolor);
      }
      return $.extend({}, this.defaultSetting, options);
    }
  }

  AlertBox.prototype._setSize = function () {
    var modalWidth  = 0
      , modalHeight = 0
      ;
    // modal box min-width and modal body min-height 
    if (this.options.modalMinWidth) {
      this.elements.modal.css("min-width", this.options.modalMinWidth);
    }
    // if set modalHeight , will not use modalBodyMinHeight
    if (this.options.modalHeight) {
      this.elements.modal.css("Height", this.options.modalHeight);
    }
    else if (this.options.modalBodyMinHeight) {
      this.elements.body.css("min-height", this.options.modalBodyMinHeight);
    }
    // modal center position
    modalWidth = this.elements.modal.width();
    modalHeight = this.elements.modal.height();
    this.elements.modal.css({"margin-left": -modalWidth/2+"px", "margin-top": -modalHeight/2+"px"});
  }

  AlertBox.prototype._getEl = function() {
    var el = {
      modal  :       this.MASK.find('.modal'),
      title  :       this.MASK.find('.title'),
      body   :       this.MASK.find('.body'),
      confirm:       this.MASK.find('.modal-confirm')
    };
    return el;
  }

  // FOR TYPE TO SET DOM SHOW
  // ========================

  AlertBox.prototype._set = function() {
    var msgHtml = "";
    if (this.options.type == "ALERT") {
      msgHtml = '<p>' + this.options.msg + '</p>';
      this.elements.body.html(msgHtml);
      
    }
    this._show(this.MASK);
    this._setSize();
  }

  AlertBox.prototype._hide = function (obj) {
    obj[0].style.display = "none";
  }

  AlertBox.prototype._show =  function (obj) {
    obj[0].style.display = "block";
  }

  // INIT PLUGIN ALERTBOX
  // ====================

  var alertbox = null;
  function Plugin(options) {
    alertbox = new AlertBox(this, options);
    return alertbox;
  }
  $.fn.alertBox = Plugin;

  // BIND EVENT TO BTNS ONCE!!!
  // ==========================

  $(document).on("click", ".modal .close, .modal .modal-close", function (event) {
    if (alertbox.options.closeWarning != false && !confirm(alertbox.options.closeWarning)) {
      return false;
    } 
    alertbox._hide(alertbox.MASK);
  });

  $(document).on('click', '.modal .modal-confirm', function(event) {
    if (alertbox.options.callback != null && $.isFunction(alertbox.options.callback)) {
      alertbox.options.callback();
    }
    alertbox._hide(alertbox.MASK);
  });

}(jQuery);
