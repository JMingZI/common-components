/**
 * @method 公用方法类Utils
 * @author jmingzi
 * @time 16/06/27
 */
'use strict';
var Utils = window.Utils || {};

/**
 * 返回指定的命名空间，如果命名空间不存在则创建命名空间。
 * 备注：命名时需小心，注意保留关键字，可能在一些浏览器无法使用。
 *
 * @method namespace
 * @param {String *} 至少需要创建一个命名空间
 * @return {Object} 最后一个命名空间创建的对象的引用
 */
Utils.namespace = function ( ns ) {
    var nsArr = ns.split("."),
        objNs = this,
        i = 0;

    if (nsArr[0] = "Utils") {
        nsArr = nsArr.slice(1);
    }

    for ( ; i < nsArr.length; ++i ) {

        if (typeof objNs[nsArr[i]] === "undefined") {
            objNs[nsArr[i]] = {};
        }

        objNs = objNs[nsArr[i]];
    }
    return objNs;
};

/**
 *  作用：提供一种验证表单的方式 validate
 *
 *  @method 表单验证
 *  @para formId {string *} 必须为表单的id
 */
Utils.formValidate = (function () {
    // 默认配置
    var validateOption = {
        isValidate: true,  // 是否使用插件验证
        isRequired: true,  // 是否必填
        dataErrorMsg: "错误",  // 验证失败后的提示语
        dataSuccessMsg: "正确",  // 验证成功后的提示语
        dataReg: /^\S.*?\S$/,  // 验证正则 (test匹配)
        dataErrorWay: "alert",  // 错误提示的方法：next(input后面的dom)、className/ID(错误容器的DOM节点)、alert(弹窗提示)
        errorColor: "red",
        normalColor: "#333",
        alertFunction: ""  // 弹窗提示方式：系统弹窗or自定义
    };

    // 自定义私有显示错误
    var _writeError = function (temp, msg, color) {
        if (temp.length > 0) {
            temp[0].innerHTML = msg;
            temp[0].style.color = color;
            return true;
        } else {
            if ( $.isFunction(validateOption.alertFunction) )
                validateOption.alertFunction('DOM error, your data-errorWay is exit?');
            else alert('DOM error, your data-errorWay is exit?');
            return false;
        }
    };

    // 自定义私有弹窗显示错误
    var _alerts = function (msg, way, color, input) {
        var temp;
        if (way != 'alert') {
            if (way == 'next') {
                temp = $(input).next();
            }
            else {
                temp = $(form).find(way);
            }
            return _writeError(temp, msg, color);
        } else {
            if ( $.isFunction(validateOption.alertFunction) ) validateOption.alertFunction(msg);
            else alert(msg);
        }
    };

    // 校验
    var _check = function (_this) {
        var isValidate, isRequired, reg, way, msg, name;
        isValidate = _this.getAttribute('isValidate');
        if (isValidate) {
            isRequired = _this.getAttribute('isRequired');
            name = _this.getAttribute('name');
            reg = _this.getAttribute('data-reg');
            way = _this.getAttribute('data-errorWay');
            msg = _this.getAttribute('data-errorMsg');

            reg = (reg == "" ? validateOption.dataReg : reg);
            way = (way == "" ? validateOption.dataErrorWay : way);
            msg = (msg == "" ? name + validateOption.dataErrorMsg : msg);
            if (isRequired || _this.value != '') {
                if (!reg.test(_this.value)) {
                    _alerts(msg, way, validateOption.errorColor, _this);
                    return false;
                }
            }
        }
        return true;
    };

    return {
        /**
         * @method 表单验证方法
         * @param formId {string} 表单form的ID
         */
        validate: function (cfg) {
            var form, formInputs, i;

            validateOption = $.extend({}, validateOption, cfg);
            form = document.getElementById(validateOption.formId);
            formInputs = $(form).serializeArray();

            // 绑定事件
            $(form).on("blur", "input", function () {
                if (_check(this) === false) return false;
            });
            $(form).on("focus", "input", function () {
                var way = this.getAttribute('data-errorWay');
                (way != 'alert') && _alerts(this.getAttribute('data-normalMsg'), way, validateOption.normalColor, this);
            });
            // 按钮点击
            $(form).on('click', '.confirm, #confirm', function () {
                for (i = 0; i < formInputs.length; i++) {
                    if (_check(form[formInputs[i].name]) === false) return false;
                }
            });
        }
    };
}());

/**
 * 公用ajax请求
 * @param url
 * @param type
 * @param data
 * @param successCallback
 * @param async
 * @param errorCallback
 * @param isHideLoading
 */
Utils.request = function (url, type, data, successCallback, async, errorCallback, isHideLoading) {
    var me = this;
    if (!isHideLoading) {
        // 创建loading
        me.showLoading();
    }
    //var contentType = "application/json;charset=UTF-8";
    var contentType = type == "post" ? "application/json;charset=UTF-8":"";
    //type == "post" ? "application/json;charset=UTF-8":"";
    data = data || {};
    data = (type == "post" ? JSON.stringify(data) : data);
    async = (async === false) ? false : true;

    $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        contentType: contentType,
        async: async,
        data: data,
        cache: false,
        success: function (data) {
            if(data.success){
                successCallback(data); }
            else {
                // 601是未登录
                if (data.status == 601) { location.href = data.data; }
                else {
                    if (typeof errorCallback == "function") errorCallback(data);
                    else me.alerts(data.msg); }
            }
        },
        error: function () {
            me.alerts("玩大了，网络或接口错误！");
        },
        complete: function () {
            me.hideLoading();
        }
    });
};

/**
 * bfun是Basic Functions Extended的缩写
 * 作用：包括数组、字符串等等数功能扩展
 *
 * @module bfun
 */
Utils.bfun = {
    alerts: function (str) {
        if (AlertBox) {
            $(".mask").alertBox(str);
        } else alert(str);
    },
    showLoading: function () {
        var that = $('body').find('.ajax-loading');
        if (that.length > 0) { that.removeClass('f-dn'); }
        else {
            $('<div class="ajax-loading">'
                +'<img src="'+ this.getRoot() +'/images/loading.gif" />'
                +'<p>正在处理</p>'
                +'</div>').appendTo($('body'));
        }
    },
    hideLoading: function () {
        var that = $('body').find('.ajax-loading');
        if (!that.hasClass('f-dn')) that.addClass('f-dn');
    },
    style: (function () {
        return {
            getComputedObj: function (obj) {
                return (obj.currentStyle? obj.currentStyle : window.getComputedStyle(obj, null));
            },
            tableStriped: function(){
               var ua = navigator.userAgent
                   , tableObj = $('.m-table-list').find('tr:odd')
                   ;
               if(ua.indexOf("MSIE 6.0")>0 || ua.indexOf("MSIE 7.0")>0 || ua.indexOf("MSIE 8.0")>0 ){
                   tableObj.css('background-color', '#f9f9f9');
               }
           }
        }
    }()),
    browser: (function () {
       return {
           getRoot: function () {
               return location.origin;
           },
           version: function () {
                var u = navigator.userAgent;
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
                if( isAndroid )
                  return "1";
                else
                  return "0";
           },
           isIE78Version: function () {
               var versionArr = navigator.appVersion.split(";");
               var version = versionArr[1].replace(/[ ]/g, "");
               if (version == "MSIE7.0" || version == "MSIE8.0") {
                   return true;
               } else return false;
           },
           getLocationSearch: function () {
               var search = location.search;
               var searchObj = {};
               var key = "";

               if (search) {
                   var paramArr = search.split("&");
                   for (var i=0; i<paramArr.length; i++) {
                       key = paramArr[i].split("=")[0];
                       key = key.replace(/\?/g, '');
                       searchObj[key] = paramArr[i].split("=")[1];
                   }
                   return searchObj;
               } else return "";
           }
       }
    }()),
    array:(function(){
        return {
            absMinArray: function () {

            }
        }
    })(),
    string:(function(){
        return {
            /**
             * @method ltrim 过滤字符串左边多余的空格
             * @param {String} 字符串
             * @return {String} 字符串
             */
            ltrim: function(){
                return arguments[0].replace(/^s+/g, "");
            },
            /**
             * @method rtrim 过滤字符串右边多余的空格
             * @param {String} 字符串
             * @return {String} 字符串
             */
            rtrim: function(){
                return arguments[0].replace(/s+$/g, "");
            },
            filterSpace: function (temp) {
                if (typeof temp == "object") {
                    for (var i in temp) {
                        (typeof temp[i] == "string") && (temp[i] = temp[i].replace(/\s/g, ""));
                    }
                }
                else if (typeof temp == "string") {
                    temp = temp.replace(/\s/g, "");
                }
                else { this.alerts("过滤函数只接受对象和字符串！"); }
                return temp;
            },
            computeFileSize: function (size) {
                if (size < 1024) {
                    return size + 'B';
                } else if (size < 1024*1024) {
                    return (size / 1024).toFixed(2) + "KB";
                } else {
                    return (size / 1024 / 1024).toFixed(2) + "M";
                }
            },
            /*
            * 输入框为数字
            * 监听粘贴，keyup，将非数字替换为数字1
            * 限制最大值
            * params {objStr string} 选择器
            * params {maxValue number}
            */
            inputTransformNumber : function (objStr, maxValue) {
                var me = this;
                var transform = function () {
                    if ( this.value.length == 1 ) {
                        this.value=this.value.replace(/[^1-9]/g, '1');
                    } else {
                        this.value=this.value.replace(/\D/g, '1');
                    }
                    if (this.value > maxValue) {
                        me.alerts("排序最大为100,000");
                        this.value = 100000;
                    }
                };
                $(document).on("afterparse", objStr, transform).on("keyup", objStr, transform);
            }
        }
    })(),
    date: (function () {
        var me = this;
        return {
            compareDays: function (start, end, type) {
                (start == "") ? me.alerts(type + "开始时间不能为空") : "";
                (end == "") ? me.alerts(type + "结束时间不能为空") : "";

                var s = start + " 00:00:00", e = end + " 23:23:59", sd = new Date(s), ed = new Date(e);
                var c = ed.getTime() - sd.getTime();
                if (c <= 0) {
                    me.alerts(type + "结束时间必须大于开始时间");
                    return false;
                }
                return c;
            },
            getTime : function(type) {
                var date = new Date(), y  = date.getFullYear(), m  = date.getMonth() + 1, d  = date.getDate(), h  = date.getHours(), f  = date.getMinutes();
                m = m > 10 ? m : "0" + m; d = d > 10 ? d : "0" + d; h = h > 10 ? h : "0" + h; f = f > 10 ? f : "0" + f;
                if (type == "expires") {
                    var start = new Date(y + "/" + m + "/" + d + " " + h + ":" + f + ":00")
                        , end = new Date(y + "/" + m + "/" + d + " " + "23:59:59")
                        , half = end.getTime() - start.getTime()
                        ;
                    return (half / (24*3600*1000)).toFixed(2);
                } else if (type == "y-m-d h:i"){
                    return y + '-' + m + '-' + d + ' ' + h + ':' + f;
                } else if (type == "y-m-d") {
                    return y + '-' + m + '-' + d;
                } else if (type == "timeStamp") {
                    return date.getTime();
                } else {
                    return +new Date();
                }
            }
        }
    }())
};

Utils.offen = {
  reg: {
      name: /.+/,
      txt: /.+/,
      url: /[a-zA-z]+:\/\/[^\s]+/,
      number: /^[1-9]\d*|0$/
  }
};

/**
 * 利用命名空间返回公用函数集
 * @type {Object}
 */
Utils.init = function () {
    this.validate = Utils.namespace("Utils.formValidate.validate");
    this.getRoot = Utils.namespace("Utils.bfun.browser.getRoot");
    this.showLoading = Utils.namespace("Utils.bfun.showLoading");
    this.hideLoading = Utils.namespace("Utils.bfun.hideLoading");
    this.alerts = Utils.namespace("Utils.bfun.alerts");
    this.search = Utils.namespace("Utils.bfun.browser.getLocationSearch");
    this.time = Utils.namespace("Utils.bfun.date.getTime");
    this.reg = Utils.namespace("Utils.offen.reg");
};

Utils.init();

