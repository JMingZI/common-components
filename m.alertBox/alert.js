+function (window) {
    function AlertBox (cfg) {
        this.cfg = cfg;
        this.showTimer = null;
        this.el = { body: this.$('body')[0] };
        this.init();
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
        toasts: function (str) {
            var toasts = this.$('.toasts')[0], msg = null;
            if (toasts) {
                msg = toasts.childNodes[0];
                msg.innerText = str;
            } else {
                var alertBox = this.createElClass("toasts");
                var alertBoxMsg = this.createElClass("msg");
                alertBoxMsg.innerText = str;
                alertBox.appendChild(alertBoxMsg);
                
                this.el.body.appendChild(alertBox);
                toasts = this.$('.toasts')[0];
            }
            this.show(toasts, true);
        },
        /*
         alerts
         @param 弹层显示的字符
         @param 弹层消失后的跳转地址，可为空。
         */
        alerts: function (str, btnText) {
            var alerts = this.$('.alerts')[0], msg = null, btn = null;
            
            if (alerts) {
                msg = alerts.childNodes[0];
                msg.innerText = str;
                btn = alerts.childNodes[1];
                btn.childNodes[0].innerText = btnText||"确定";
            } else {
                this.createAlertBox(str, btnText);
                alerts = this.$('.alerts')[0];
            }
            this.show(alerts.parentNode, false);
        },
        /*
         带回调函数的警告框
         @param 弹层显示的字符
         @param 弹窗标题，默认为提示
         */
        confirms: function (str, title, confirmText, confirmCallback) {
            this.confirmCallback = confirmCallback;
            
            var confirms = this.$('.confirms')[0];
            if (confirms) {
                this.resetConfirms();
                confirms.getElementsByClassName('msg')[0].getElementsByTagName('p')[0].innerText = str;
                confirms.getElementsByClassName("title")[0].innerText = title || "";
                this.$('#confirms-confirm').innerText = confirmText||"确定";
                
            } else {
                this.createConfirmBox(str, title, confirmText);
                confirms = this.$('.confirms')[0];
            }
            this.show(confirms, false);
            
            if (this.cfg.debug || this.isiOS) confirms.classList.add('iOS');
            else confirms.classList.remove('iOS');
        },
        confirmCallback: function (){},
        /*
         输入文本的弹层，带回调函数
         @param 输入文本的placeholder
         @param 弹窗标题，默认为提示
         */
        prompts: function (placeholderStr, title, confirmText, confirmCallback) {
            var prompts = this.$('.prompts')[0];
            if (prompts) {
                this.resetConfirms();
                this.changeConfirmToPrompt(placeholderStr, title, confirmText, confirmCallback);
            } else {
                this.changeConfirmToPrompt(placeholderStr, title, confirmText, confirmCallback);
                prompts = this.$('.prompts')[0];
            }
            this.show(prompts, false);
            
            if (this.cfg.debug || this.isiOS) prompts.classList.add('iOS');
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
        isiOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
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
        createAlertBox: function (str, btnText) {
            var mask = this.createElClass("mask");
    
            var alertBox = this.createElClass("alerts");
            var alertBoxMsg = this.createElClass("alert-msg");
            var div = this.createElClass("");
            var btn = document.createElement("a");
            btn.href = "javascript:;";
            btn.className = "confirms-btn confirms-alert";
            btn.id = "confirms-cancel";
            btn.appendChild(document.createTextNode(btnText || "确定"));
            div.appendChild(btn);
            
            alertBoxMsg.innerText = str;
            alertBox.appendChild(alertBoxMsg);
            alertBox.appendChild(div);
    
            mask.appendChild(alertBox);
            this.el.body.appendChild(mask);
        },
        /*
         创建警告框
         并添加到body子节点
         */
        createConfirmBox: function (str, title, confirmText) {
            var confirms = this.createElClass("confirms");
            var confirmBox = this.createElClass("confirms-box");
            var msg = this.createElClass("msg");
            var confirmBtns = this.createElClass("confirms-btns");
            var titleNode = this.createElClass("title", title || "");
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
            confirm.appendChild(document.createTextNode( confirmText||"确定" ));
            
            msg.appendChild(titleNode);
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
                confirms.getElementsByClassName("title")[0].innerText = "";
            var msg = confirms.getElementsByClassName('msg')[0];
                msg.getElementsByTagName('p')[0].style.display = "block";
            var textarea = document.getElementById('confirms-prompt');
            if (textarea) msg.removeChild(textarea);
        },
        /*
         在警告框的基础上
         修改节点为文本输入框
         */
        changeConfirmToPrompt: function (placeholderStr, title, confirmText, confirmCallback) {
            this.confirmCallback = confirmCallback;

            var confirms = this.$('.confirms')[0];
            if (!confirms) {
                this.createConfirmBox(placeholderStr, title, confirmText, confirmCallback);
                confirms = this.$('.confirms')[0];
            } else {
                confirms.getElementsByClassName("title")[0].innerText = title || "";
                this.$('#confirms-confirm').innerText = confirmText||"确定";
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
            // document.body.style.overflow = "hidden";
            
            // if (!$(showNode).hasClass('alertFadeIn')) {
            if (JSON.stringify(showNode.classList).indexOf('alertFadeIn') == -1) {
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
    
    var alertbox = new AlertBox({
        debug: false, //开启后，在安卓中也显示iOS弹窗
        alertBoxKeepTime: 2000, //普通弹窗显示时间
        promptMaxlength: 20 //prompt文本输入的最大长度
    });
    
    /*
     事件委托
     */
    var eventBind = function (type, dom, fn) {
        var domObj = null;
        document.body.addEventListener(type, function (event) {
            event = event || window.event;
            domObj = document.getElementById(dom);
            if (event.target && domObj && event.target.id === domObj.id) {
                event.stopPropagation();
                fn(event.target);
            }
        }, false);
    };
    
    eventBind('click', 'confirms-cancel', function (ev) {
        alertbox.hide(ev.parentNode.parentNode.parentNode);
    });
    
    eventBind('click', 'confirms-confirm', function (ev) {
        alertbox.confirmCallback && alertbox.confirmCallback();
        alertbox.hide(ev.parentNode.parentNode.parentNode);
    });
    
    window.alertbox = alertbox;
}(window);
