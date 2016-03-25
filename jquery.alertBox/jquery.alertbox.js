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
                    this._reset();
                    this._set();
  };

  AlertBox.prototype.defaultSetting = {
    type              : "alert", // type ALERT or CONFIRM or MODAL
    width             : '400px',
    height            : '200px',
    msg               : "",
    maskcolor         : "rgba(0, 0, 0, 0.5)",
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
    if (this.options.width) this.elements.modal.css("width", this.options.width);

    // if set modalHeight 
    if (this.options.height) {
        this.elements.modal.css("height", this.options.height);
        this.elements.body.css("height", parseInt(this.options.height) - this.elements.head.outerHeight() - 
        this.elements.foot.height() + "px");
    }

    // modal center position
    modalWidth = this.elements.modal.width();
    modalHeight = this.elements.modal.height();
    this.elements.modal.css({"margin-left": -modalWidth/2+"px", "margin-top": -modalHeight/2+"px"});
  }

  AlertBox.prototype._getEl = function() {
    var el = {
      modal  :       this.MASK.find('.modal'),
      head   :       this.MASK.find('.head'),
      foot   :       this.MASK.find('.foot'),
      title  :       this.MASK.find('.title'),
      body   :       this.MASK.find('.body'),
      close  :       this.MASK.find('.modal-close'),
      confirm:       this.MASK.find('.modal-confirm')
    };
    return el;
  }

  // FOR TYPE TO SET DOM SHOW
  // ========================

  AlertBox.prototype._set = function() {
    var msgHtml = "";
    if (this.options.type == "alert") {
      msgHtml = '<p>' + this.options.msg + '</p>';
      this.elements.body.html(msgHtml);
      this.elements.close[0].style.display = "none";

      this.elements.confirm.addClass('close');
    } 
    
    this._show(this.MASK);
    this._setSize();
  }

  AlertBox.prototype._reset = function () {
    this.elements.modal.css({'width': this.options.width, 'height': this.options.height});
    this.MASK.css("background-color", this.options.maskcolor);
    this.elements.body.html("");
    this.elements.title.text(this.options.title);
    this.elements.close[0].style.display = "inline";
    this.elements.confirm.removeClass('close');
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

}(jQuery);
