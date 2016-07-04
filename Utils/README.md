# 公用工具类

在项目中引入，初始化：

```js
Utils.init = function () {
  // 命名空间初始化
  var validate = Utils.namespace("Utils.formValidate.validate");
  validate({
      formId: 'form',
      errorColor: "red",
      normalColor: "green",
      alertFunction: ""  // 弹窗提示方式：系统弹窗or自定义
  });
}

Utils.init();
```

#### 包含的方法

- 表单验证  
html结构
```html
<form action="" id="form">
  <div class="form-group">
      姓名：<input type="text" name="username" isValidate="true" isRequired="true" data-normalMsg="111" data-errorMsg="" data-reg="" data-errorWay=".error">
      <span class="error"></span>
  </div>
  <div class="form-group">
      密码：<input type="text" name="pwd" isValidate="true" isRequired="true" data-errorMsg="" data-reg="" data-errorWay="next">
      <span class="error"></span>
  </div>
  <div class="form-group">
      邮箱：<input type="text" name="email" isValidate="true" data-errorMsg="" data-reg="" data-errorWay="alert">
      <span class="error"></span>
  </div>
  <button type="button" id="confirm" value="提交">提交</button>
</form>
```
DOM属性说明
```js
/**
 * 属性说明：
 * @param: isValidate 是否使用插件验证
 * @param: isRequired 是否必填
 * @param: data-reg 验证正则 (test匹配)
 * @param: data-normalMsg 验证成功后的提示语
 * @param: data-errorMsg 验证失败后的提示语
 * @param: data-errorWay 错误提示的方法：next(input后面的dom)、className/ID(错误的DOM节点)、alert(弹窗提示)
 */
 ```
