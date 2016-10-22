/**
 * @全局回调函数
 */
window.moveEndPage = function () {};
/**
 * 绑定document上的move事件，调用set方法
 * 绑定某个元素，直接在元素上加上move监听，调用outTouchstart， outTouchend函数即可
 */
var slideDirection = {
    outParams: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    },
    /*
     * @angle number>0，用来衡量向左向右的角度
     * @callback function，滚动正确的回调
     */
    init: function (angle, callback) {
        this.setAngle = angle;
        //滑动处理
        var startX, startY, me = this;
        document.addEventListener('touchstart', function (ev) {
            ev.stopPropagation();
            startX = ev.touches[0].pageX;
            startY = ev.touches[0].pageY;
        }, false);
        document.addEventListener('touchend', function (ev) {
            ev.stopPropagation();
            var endX, endY;
            endX = ev.changedTouches[0].pageX;
            endY = ev.changedTouches[0].pageY;
            
            var direction = me.GetSlideDirection(startX, startY, endX, endY);
            callback && callback(direction);
        }, false);
    },
    outTouchstart: function(ev){
        slideDirection.outParams.startX = ev.changedTouches[0].pageX;
        slideDirection.outParams.startY = ev.changedTouches[0].pageY;
    },
    outTouchend: function(ev){
        slideDirection.outParams.endX = ev.changedTouches[0].pageX;
        slideDirection.outParams.endY = ev.changedTouches[0].pageY;
        
        var direction = slideDirection.GetSlideDirection(
            slideDirection.outParams.startX,
            slideDirection.outParams.startY,
            slideDirection.outParams.endX,
            slideDirection.outParams.endY
        );
        
        var listDom = document.getElementsByClassName("list")[0];
        var listDomBody = listDom.getElementsByClassName("list-body")[0];
        
        if (direction == 1) { // 向上
            let windowHeightScrollTop =  listDom.offsetHeight + listDom.scrollTop;
            // 页面滚动到底部
            if (listDomBody.offsetHeight <= windowHeightScrollTop) {
                console.log("set page");
                window.moveEndPage && window.moveEndPage();
            }
        }
    },
    //返回角度
    GetSlideAngle: function(dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
    },
    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    GetSlideDirection: function(startX, startY, endX, endY) {
        var dy = startY - endY;
        var dx = endX - startX;
        var result = 0;
        
        this.setAngle = this.setAngle || 5;
        
        //如果滑动距离太短
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) { return result; }
        
        var angle = this.GetSlideAngle(dx, dy);
        if (angle >= -this.setAngle && angle < this.setAngle) {
            result = 4;
        } else if (angle >= this.setAngle && angle < (180 - this.setAngle) ) {
            result = 1;
        } else if (angle >= -(this.setAngle + 180) && angle < -this.setAngle) {
            result = 2;
        }
        else if ((angle >= (180 - this.setAngle) && angle <= 180) || (angle >= -180 && angle < -(180 - this.setAngle))) {
            result = 3;
        }
        return result;
    },
    set: function () {
        this.init(5, function (data) {
            if (data == 1) { // 向上
                let windowHeightScrollTop = document.documentElement.clientHeight + document.body.scrollTop;
                // 页面滚动到底部
                if (document.body.offsetHeight <= windowHeightScrollTop) {
                    window.moveEndPage && window.moveEndPage();
                }
            }
        });
    }
};
module.exports = slideDirection;