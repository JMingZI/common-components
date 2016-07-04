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
 * bfun是Basic Functions Extended的缩写
 * 作用：包括数组、字符串等等数功能扩展
 *
 * @module bfun
 */
Utils.bfun = {
    array:(function(){
        return {
            /**
             * @method isArray 判断是否为数组
             * @param {Array} 数组
             * @return {Boolean} 真返回true，否则返回false
             */
            isArray: function(){
                return Object.prototype.toString.call(arguments[0])  === '[object Array]';
            },
            /**
             * @method inArray 检查值是否在数组中
             * @param {value，Array} 值，数组
             * @return {Boolean} 真返回true，否则返回undefined
             */
            inArray: function(val,arr){
                for(var i=0,l=arr.length;i<l;i++){
                    if(arr[i] === val){
                        return true;
                    }
                }
            }
        }
    })(),
    string:(function(){
        return {
            /**
             * @method trim 过滤字符串两边多余的空格
             * @param {String} 字符串
             * @return {String} 字符串
             */
            trim: function(){
                return arguments[0].replace(/(^\s*)|(\s*$)/g, "");
            },
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
            }
        }
    })()
};
