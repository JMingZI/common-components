var Common = {
    toasts: function(msg, time) {
        if (alertbox) {
            alertbox.toasts(msg);
        } else if (this.cookie("orgType")) {
            this.native("toast", {time: time||3, msg: msg});
        } else alert(msg);
    },
    alerts: function (str, btnText, title) {
        if (alertbox) {
            alertbox.alerts(str, btnText||"确定");
        } else if (this.cookie("orgType")) {
            this.native("alert", {title: title||"提示", msg: str});
        } else alert(str);
    },
    // 将 键值对 序列化为参数
    function serialize(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".",""));
        return arr.join("&");
    }
    // 原生ajax
    ajax: function (options) {
        var params, xhr;
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        params = this.serialize(options.data);

        xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
    }
    cookie: function (name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    },
    native: function (method, data) {
        var t = null;
        window.JSBridge.requestHybrid({
            method: method,
            data: data,
            callback: function(result) {
                t && t(result);
            }
        });
        return {
            then: function(f) {
                t = f;
            }
        };
    },
    substrs: function (str, len) {
        if (str.length <= len) return len;
        else return str.substr(len) + "...";
    },
    // 补全 0
    compeleteZero: function (number) {
        return number > 9 ? number : "0" + number;
    },
    // 获取当前时间
    getTime: function () {
        var time = new Date(), y = time.getFullYear(), m = time.getMonth() + 1
            , r = time.getDate(), s = time.getHours(), f = time.getMinutes()
            , a = time.getMinutes();
        m = this.compeleteZero(m);
        r = this.compeleteZero(r);
        s = this.compeleteZero(s);
        f = this.compeleteZero(r);
        a = this.compeleteZero(a);
        return "" + y + "/" + m + "/" + r + " " + s + ":" + f + ":" + a;
    }
    // 比较 2个 时间大小
    compareTime: function(start, end) {
        if (start == "" || end == "") return true;
        var s = start.replace(/-/g, "/"), e = end.replace(/-/g, "/"),
            sd = new Date(s), ed = new Date(e);
        return ed.getTime() - sd.getTime();
    },
    request: function (url, type, data, contentType, successCallback, async, errorCallback) {
        var me = this;
        contentType =  contentType || "application/x-www-form-urlencoded";
        data = data || {};
        data = (contentType == "application/json;charset=UTF-8" ? JSON.stringify(data) : data);
        $.ajax({
            url: url + (me.debug && type == "get" ? "?debug=true&userId=269840" : ""),
            type: type,
            dataType: 'json',
            contentType: contentType,
            async: false,
            data: data,
            cache: false,
            success: function (data) {
                if (data.success) {
                    successCallback(data);
                } else {
                    if (data.status == 601) { location.href = data.data; }
                    else {
                        if (typeof errorCallback == "function") errorCallback(data);
                        else me.alerts(data.msg);
                    }
                }
            },
            error: function () {
                me.alerts(me.ajaxErrorMsg);
            },
            complete: function () {
                // do
            }
        });
    },
    // 图片预加载
    preloadimages: function(arr){
        var newimages=[];
        var errorInfo = [];
        for (var i = 0; i<arr.length; i++){
            newimages[i] = new Image();
            newimages[i].src = arr[i];
            newimages[i].onload = function(){}
            newimages[i].onerror = function(i){
                errorInfo.push(arr[i] + "加载失败！");
            }
        }
        return {
            done: function(f){
                f && f(errorInfo);
            }
        }
    },
    // 查询字符串
    searchs: (function () {
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
    }())
};