(function (window) {
	var script, themeArr, theme, path;
	// 引入方式
	// theme, path 是参数 需要判断
	if (typeof exports === 'object') {
		module.exports = {
			init: function (option) {
				theme = option.theme;
				path = option.path
			},
			showLoading: showLoading,
			hideLoading: hideLoading
		}
	} else {
		// 此处 check 后 赋值 theme, path
		check()
		window.showLoading = showLoading
		window.hideLoading = hideLoading
	}

	var commonStyle = 'position:fixed;transition:all .5s;-webkit-transition:all .5s;'
	var mask = createMask(), div, img, p, divStyle;
	
	switch (theme) {
		case 'shalou': {
			divStyle = 'top:50%;left:50%;z-index:1001;'
				+ 'font-size: 14px;'
				+ 'margin-left:-30px;margin-top:-30px;'
				+ 'text-align:center;border-radius:5px;'
				+ commonStyle;
			div = createDivBox(divStyle)
			img = createImg(path + 'loading/images/hourglass.svg')
			p = createText()
			
			div.appendChild(img)
			div.appendChild(p)
		}break;
		default: {
			divStyle = 'top:50%;left:50%;z-index:1001;'
				+ 'height:60px;'
				+ 'font-size: 14px;'
				+ 'margin-left:-30px;margin-top:-30px;'
				+ 'background-color:rgba(0,0,0,0.6);'
				+ 'text-align:center;border-radius:5px;'
				+ commonStyle;
			div = createDivBox(divStyle)
			img = createImg(path + 'loading/images/default.svg')
			div.appendChild(img)
		}
	}
	document.body.appendChild(mask)
	document.body.appendChild(div)
	
	// check
	function check () {
		if (!document.body) { alert("请在body标签内引入loading！");return false; }
		script = document.getElementById('mui-loading')
		if (!script) { alert('请为loading引入的script标签添加id为mui-loading');return false; }
		// theme
		theme = script.getAttribute('theme')
		themeArr = {default: true, shalou: true}
		if (!themeArr[theme]) theme = 'default'
		// path
		path = script.getAttribute('path')
		if (!path) path = './'
	}
	
	// mask
	function createMask () {
		var mask = document.createElement('div')
		var maskStyle = 'left:0;top:0;z-index:1000;'
			+ 'width:100%;height:' + window.screen.height + 'px;'
			+ 'background-color:rgba(255,255,255, .9);filter:blur(10px);-webkit-filter:blur(10px);'
			+ commonStyle
		mask.setAttribute('style', maskStyle)
		return mask;
	}
	
	// loading-div box
	function createDivBox (style) {
		var div = document.createElement('div')
			div.setAttribute('style', style)
		return div;
	}
	
	// loading img
	function createImg (src) {
		var img = document.createElement('img')
		var imgStyle = 'width:40px;height:40px;margin:10px;margin-bottom:0;'
			img.src = src
			img.setAttribute('style', imgStyle)
		return img;
	}
	
	// box p
	function createText() {
		var p = document.createElement('p')
			p.innerText = '加载中'
		return p;
	}
	
	function showLoading () {
		mask.style.display = 'block'
		div.style.display = 'block'
	}
	function hideLoading () {
		mask.style.display = 'none'
		div.style.display = 'none'
	}
})(window)