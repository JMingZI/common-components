"use strict";
var YmDrag = YmDrag || {};

/**
 * 控件库
 */
YmDrag.componentLib = {
    'ym-component-singleText': {
        type: "singleText",
        widgetName: "singleText",
        widgetMaxLength: 10,
        title: "单行输入框",
        label: {
            txt: "单行输入框",
            maxlength: 10
        },
        placeholder: {
            txt: "请输入",
            maxlength: 20
        },
        require: true
    },
    'ym-component-mutiText': {
        type: "mutiText",
        widgetName: "mutiText",
        title: "多行输入框",
        widgetMaxLength: 10,
        label: {
            txt: "多行输入框",
            maxlength: 10
        },
        placeholder: {
            txt: "请输入",
            maxlength: 20
        },
        require: true
    },
    'ym-component-date': {
        type: "date",
        widgetName: "date",
        title: "日期",
        label: {
            txt: "日期",
            maxlength: 10
        },
        placeholder: {
            txt: "请选择",
            maxlength: 20
        },
        require: true,
        options: {
            type: 'radio',
            name: "format",
            label: "日期类型",
            value: 'yyyy-MM-dd HH:mm',
            item: [
                {txt: '年-月-日 时:分', v: 'yyyy-MM-dd HH:mm'},
                {txt: '年-月-日', v: 'yyyy-MM-dd'}
            ]
        }
    },
    'ym-component-singleChoose': {
        type: "singleChoose",
        widgetName: "singleChoose",
        title: "单选框",
        label: {
            txt: "单选框",
            maxlength: 10
        },
        placeholder: {
            txt: "请选择",
            maxlength: 20
        },
        require: true,
        options: {
            type: "text",
            label: "选项",
            name: "singleChoose",
            maxlength: 10,
            value: "选项",
            item: [
                {txt: "选项", v: "选项"}
            ]
        }
    },
    'ym-component-photos': {
        type: "img",
        widgetName: "img",
        title: "图片",
        label: {
            txt: "图片",
            maxlength: 10
        },
        require: true,
        options: {
            type: "img",
            label: "按钮图标",
            name: "photos",
            value: "images/photos-icon1.png",
            item: [
                {txt: "icon", v: "images/photos-icon1.png"}
            ]
        }
    },
    'ym-component-dateBlock': {
        type: "dateBlock",
        widgetName: "dateBlock",
        title: "日期区间",
        label: {
            txt: "开始时间",
            maxlength: 10
        },
        label2: {
            txt: "结束时间",
            maxlength: 10
        },
        require: true,
        options: {
            type: 'radio',
            name: "format",
            label: "日期类型",
            value: 'yyyy-MM-dd HH:mm',
            item: [
                {txt: '年-月-日 时:分', v: 'yyyy-MM-dd HH:mm'},
                {txt: '年-月-日', v: 'yyyy-MM-dd'}
            ]
        }
    }
};



