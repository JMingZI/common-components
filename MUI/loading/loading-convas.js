(function (window) {
	var Loading = function (options) {
		this.options = options;
		this.canvas = this.timer = null;
		this.init();
	};
	Loading.prototype = {
		constructor: Loading,
		init: function () {
			this.canvas = document.getElementById(this.options.id);
			if (!this.canvas) {
				this.canvas = document.createElement('canvas')
				this.canvas.id = this.options.id
				this.canvas.width = '45'
				this.canvas.height = '45'
				document.body.appendChild(this.canvas)
			}
			// canvas style
			this.css({
				'position': 'fixed',
				'left': '50%',
				'top': '50%',
				'margin-left': '-30px',
				'margin-top': '-30px',
				'padding': '7.5px',
				'background-color': 'rgba(0,0,0, .7)',
				'border-radius': '6px',
				'z-index': '9999'
			}, this.canvas);
		},
		css: function (styles, obj) {
			for (var property in styles) {
				obj.style[property] = styles[property]
			}
		},
		show: function () {
			this.canvas.style.display = 'block';
			
			var canvas = this.canvas,
				begin = this.options.begin,
				old = this.options.old,
				lineWidth = this.options.lineWidth,
				canvasCenter = {x: canvas.width / 2, y: canvas.height / 2},
				ctx = canvas.getContext("2d"),
				color = this.options.color,
				num = this.options.num,
				angle = 0,
				lineCap = this.options.lineCap,
				CONST_PI = Math.PI * (360 / num) / 180;
			
			this.timer = setInterval(function () {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				for (var i = 0; i < num; i += 1) {
					ctx.beginPath();
					ctx.strokeStyle = color[num - 1 - i];
					ctx.lineWidth = lineWidth;
					ctx.lineCap= lineCap;
					ctx.moveTo(canvasCenter.x + Math.cos(CONST_PI * i + angle) *
						begin, canvasCenter.y + Math.sin(CONST_PI * i + angle) * begin);
					ctx.lineTo(canvasCenter.x + Math.cos(CONST_PI * i + angle) *
						old, canvasCenter.y + Math.sin(CONST_PI * i + angle) * old);
					ctx.stroke();
					ctx.closePath();
				}
				angle += CONST_PI;
			},50);
		},
		hide: function () {
			clearInterval(this.timer);
			this.canvas.style.display = 'none';
		}
	};
	
	var options = {
		id: "canvas",
		num : 8,
		begin: 10,
		old: 17,
		lineWidth: 2,
		lineCap: "round",
		colorReverse: ["rgb(0, 0, 0)", "rgb(20, 20, 20)","rgb(40, 40, 40)", "rgb(60, 60, 60)","rgb(80, 80, 80)",
			"rgb(100, 100, 100)", "rgb(120, 120, 120)", "rgb(140, 140, 140)"],
		color: ["rgb(255, 255, 255)", "rgb(235, 235, 235)","rgb(215, 215, 215)", "rgb(195, 195, 195)","rgb(175, 175, 175)",
			"rgb(155, 155, 155)", "rgb(135, 135, 135)", "rgb(115, 115, 115)"]
	};
	var loading = new Loading(options);
	loading.show();
	
	if (typeof exports === 'object') {
		module.exports = loading
	} else {
		window.loading = loading
	}
})(window)
