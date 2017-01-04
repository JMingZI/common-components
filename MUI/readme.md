### 关于loading轮子

特性：
+ 单文件引入/import导入/拷贝
+ `svg` base64图片加载
+ `Loading.show()` 的时候 `document.documentElement = overflow:hidden`
+ 样式图片随时可修改

使用：

+ es6 `common.js规范`，可直接 `import loading from loading-svg.js`; 
+ 普通的引入 直接在body标签内引入

方法：

+ `loading.show()` 
+ `loading.hide()`