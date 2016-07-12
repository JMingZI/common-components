"use strict";
var YmDrag = {};

YmDrag.init = function (params) {
    this.body = $("body");
    this.opts = params;
    this.bindEvents();
};

/**
 * 组件库
 */
YmDrag.componentLib = {
    'ym-component-date': '<input type="text" name="date">',
    'ym-component-img': '<div class="img"></div>'
};

/**
 * 是否在 起始或目标div 中
 * @params {type string} 盒子类型
 * @params {pageX number} x值
 * @params {pageY number} y值
 */
YmDrag.isInBox = function (type, pageX, pageY) {
    var box = null;
    if (type == "from") box = this.opts.dragFromBox;
    else box = this.opts.dragToBox;

    return !!(pageX >= box.offset().left
    && pageX < (box.offset().left + box.width())
    && pageY >= box.offset().top
    && pageY < (box.offset().top + box.height()));
};

/**
 * 添加目标位置指引
 * @params {pageX number} x值
 * @params {pageY number} y值
 */
YmDrag.addTargetMark = function (pageY) {
    var me = this, targetLine = me.body.find(".target-line");

    var data = me.computeMovePosition(pageY),
        temp = me.opts.dragToBox.find(".ym-drag-item").eq(data.index);

    //创建line
    if (targetLine.length != 0) { targetLine.remove(); }
    else { targetLine = $('<div></div>').addClass("target-line"); }

    if (data.fx == 'after') {
        temp.after(targetLine);
    } else {
        temp.before(targetLine);
    }
    targetLine.css('display', 'block');
};

/**
 * 计算移动的位置
 * @param pageY
 * @returns {{index: number, fx: string}}
 */
YmDrag.computeMovePosition = function (pageY) {
    var me = this;
    var top = 0, itemLen = 0, itemHeightArr = [];
    me.opts.dragToBox.find(".ym-drag-item").each(function (i) {
        itemLen = me.opts.dragToBox.find(".ym-drag-item").length;

        // 子元素逐个对比高度
        if (itemLen == 1) {
            // 只有一个子元素时
            top = 0;
        } else {
            // 当含有2个以上的子元素时，
            // 判断当前的pageY与前一个子元素的高度差
            top = pageY - me.opts.dragToBox.offset().top;

            if (i < itemLen-1) {
                // 记录offsetTop + 自身高度的一半
                itemHeightArr.push( $(this).offset().top - me.opts.dragToBox.offset().top + $(this).outerHeight(true) / 2);
            }
        }
    });
    // 判断当前的高度差
    return me.compareTop(top, itemHeightArr);
};

/**
 * 比较高度差与每一个子元素一般高度的大小
 * @param v
 * @param arr
 * @returns {{index: number, fx: string}}
 */
YmDrag.compareTop = function (v, arr) {
    var data = {
        index: 0,
        fx: 'before'
    }, min = 0, fall = [];

    if (arr.length == 0) {}
    else if (arr.length == 1) {
        // arr只有一位数
        (v - arr[0] > 0) ? (data.fx = 'after') : (data.fx = 'before');
    } else {
        $.each(arr, function (i) { fall.push(v - arr[i]); });
        // 先找到最小值
        min = fall[0];
        $.each(fall, function (i) {
            if (Math.abs(fall[i]) < Math.abs(min)) {
                min = fall[i];
            }
        });
        // 找到最小值的下标，以及符号
        $.each(fall, function (i) {
            if (fall[i] == min) {
                data.index = i;
                if (fall[i] > 0) {
                    data.fx = 'after';
                }
                else data.fx = 'before';
            }
        });
    }
    return data;
};

/**
 * 事件绑定
 */
YmDrag.bindEvents = function () {
    var me = this
        , _move = false // 是否可以移动
        , _moveX // 移动时的x
        , _moveY // 移动时的y
        , _downX // 鼠标按下的x
        , _downY // 鼠标按下的y
        , dragCurrNode // 当前选中的组件
        , cloneDragNode // 对应组建库的组件
        ;

    // 控件盒子 拖拽绑定
    me.opts.dragFromBox.find('.ym-drag-item').on("click", function (e) {
        e.stopPropagation();
        // 此处不会执行
    }).mousedown(function(e){
        _move = true;
        dragCurrNode = $(this);
        dragCurrNode.fadeTo(20, 0.5);

        _downX = e.pageX - parseInt( dragCurrNode.offset().left );
        _downY = e.pageY - parseInt( dragCurrNode.offset().top );
        // 添加到目标box
        cloneDragNode = dragCurrNode.clone();
        cloneDragNode.css('visibility', "hidden").appendTo( me.opts.dragToBox );
    });

    // 目标盒子 拖拽绑定
    me.opts.dragToBox.on("click", '.ym-drag-item', function (e) {
        e.stopPropagation();
        // 此处不会执行
    });
    me.opts.dragToBox.on('mousedown', '.ym-drag-item', function(e){
        _move = true;
        dragCurrNode = $(this);
        dragCurrNode.fadeTo(20, 0.5);

        _downX = e.pageX - parseInt( dragCurrNode.offset().left );
        _downY = e.pageY - parseInt( dragCurrNode.offset().top );
        // 添加到目标box
        cloneDragNode = dragCurrNode.clone();
        cloneDragNode.css('visibility', "hidden").appendTo( me.opts.dragToBox );
    });

    // move监听
    $(document).mousemove(function(e){
        if ( _move ) {
            !cloneDragNode.hasClass("draging") && cloneDragNode.css('visibility', "visible").addClass("draging");

            _moveX = e.pageX - _downX;
            _moveY = e.pageY - _downY;
            cloneDragNode.css({ top: _moveY, left: _moveX });

            if ( me.isInBox("from", _moveX, _moveY) ) {
                cloneDragNode.attr("data-nowBox", "from");
            } else if ( me.isInBox("to", _moveX, _moveY) ){
                cloneDragNode.attr("data-nowBox", "to");
                // 添加目标线
                me.addTargetMark(_moveY);
            } else {
                cloneDragNode.removeAttr("data-nowBox");
            }
        }
    }).mouseup(function(e){
        if ( _move ) {
            _move = false;
            dragCurrNode.fadeTo("fast", 1);

            _moveX = e.pageX - _downX;
            _moveY = e.pageY - _downY;
            if ( !me.isInBox("to", _moveX, _moveY) ) {
                me.opts.dragToBox.find(cloneDragNode).remove();
            } else {
                //还原组件
                cloneDragNode.removeClass("draging").addClass("dragged").html(me.componentLib[cloneDragNode.attr("data-componentName")]);

                var temp = me.opts.dragToBox.find('.ym-drag-item');
                // 变为可编辑目标
                cloneDragNode.addClass('curr-edit');
                cloneDragNode.siblings('.ym-drag-item').removeClass('curr-edit');

                if (temp.length > 1) {
                // 如果子元素数量大于1才需要考虑
                    // 计算目标位置
                    var data = me.computeMovePosition(_moveY),
                        temp = temp.eq(data.index);
                    if (data.fx == 'after') {
                        temp.after(cloneDragNode);
                    } else {
                        temp.before(cloneDragNode);
                    }
                }

                // 如果拖动的是目标盒子 子元素
                if (dragCurrNode.attr('data-nowbox') == 'to') {
                    dragCurrNode.remove();
                }
            }
            cloneDragNode.css('visibility', "visible");
            // 隐藏目标线
            me.body.find(".target-line").css("display", "none");

            // 拖拽完成回调
            me.opts.dragCompleteCallback(cloneDragNode);
        }
    });
};

// 初始化
$(function(){
    YmDrag.init({
        dragFromBox: $('.ym-drag-from'),
        dragToBox: $('.ym-drag-to'),
        itemMargin: 10,
        dragCompleteCallback: function (dragObj) { alert(dragObj.attr('class')); }
    });
});