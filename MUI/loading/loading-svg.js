(function (window) {
	var Loading = {
		init: function () {
			this.img = null;
			Element.prototype.addStyle = function (styles) {
				for (var property in styles) {
					this.style[property] = styles[property]
				}
			}
			this.createImg ()
		},
		createImg: function () {
			this.img = document.createElement('img')
			this.img.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHdpZHRoPSc1MHB4JyBoZWlnaHQ9JzUwcHgnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiBjbGFzcz0idWlsLWhvdXJnbGFzcyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9Im5vbmUiIGNsYXNzPSJiayI+PC9yZWN0PjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZhNTY1YSIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik01OC40LDUxLjdjLTAuOS0wLjktMS40LTItMS40LTIuM3MwLjUtMC40LDEuNC0xLjQgQzcwLjgsNDMuOCw3OS44LDMwLjUsODAsMTUuNUg3MEgzMEgyMGMwLjIsMTUsOS4yLDI4LjEsMjEuNiwzMi4zYzAuOSwwLjksMS40LDEuMiwxLjQsMS41cy0wLjUsMS42LTEuNCwyLjUgQzI5LjIsNTYuMSwyMC4yLDY5LjUsMjAsODUuNWgxMGg0MGgxMEM3OS44LDY5LjUsNzAuOCw1NS45LDU4LjQsNTEuN3oiIGNsYXNzPSJnbGFzcyI+PC9wYXRoPjxjbGlwUGF0aCBpZD0idWlsLWhvdXJnbGFzcy1jbGlwMSI+PHJlY3QgeD0iMTUiIHk9IjIwIiB3aWR0aD0iNzAiIGhlaWdodD0iMjUiIGNsYXNzPSJjbGlwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJoZWlnaHQiIGZyb209IjI1IiB0bz0iMCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZsYXVlcz0iMjU7MDswIiBrZXlUaW1lcz0iMDswLjU7MSI+PC9hbmltYXRlPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InkiIGZyb209IjIwIiB0bz0iNDUiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2bGF1ZXM9IjIwOzQ1OzQ1IiBrZXlUaW1lcz0iMDswLjU7MSI+PC9hbmltYXRlPjwvcmVjdD48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0idWlsLWhvdXJnbGFzcy1jbGlwMiI+PHJlY3QgeD0iMTUiIHk9IjU1IiB3aWR0aD0iNzAiIGhlaWdodD0iMjUiIGNsYXNzPSJjbGlwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJoZWlnaHQiIGZyb209IjAiIHRvPSIyNSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZsYXVlcz0iMDsyNTsyNSIga2V5VGltZXM9IjA7MC41OzEiPjwvYW5pbWF0ZT48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJ5IiBmcm9tPSI4MCIgdG89IjU1IiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmxhdWVzPSI4MDs1NTs1NSIga2V5VGltZXM9IjA7MC41OzEiPjwvYW5pbWF0ZT48L3JlY3Q+PC9jbGlwUGF0aD48cGF0aCBkPSJNMjksMjNjMy4xLDExLjQsMTEuMywxOS41LDIxLDE5LjVTNjcuOSwzNC40LDcxLDIzSDI5eiIgY2xpcC1wYXRoPSJ1cmwoI3VpbC1ob3VyZ2xhc3MtY2xpcDEpIiBmaWxsPSIjZmE1NjVhIiBjbGFzcz0ic2FuZCI+PC9wYXRoPjxwYXRoIGQ9Ik03MS42LDc4Yy0zLTExLjYtMTEuNS0yMC0yMS41LTIwcy0xOC41LDguNC0yMS41LDIwSDcxLjZ6IiBjbGlwLXBhdGg9InVybCgjdWlsLWhvdXJnbGFzcy1jbGlwMikiIGZpbGw9IiNmYTU2NWEiIGNsYXNzPSJzYW5kIj48L3BhdGg+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgNTAgNTAiIHRvPSIxODAgNTAgNTAiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjFzIiB2YWx1ZXM9IjAgNTAgNTA7MCA1MCA1MDsxODAgNTAgNTAiIGtleVRpbWVzPSIwOzAuNzsxIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9nPjwvc3ZnPg=='
			
			var width = 34;
			this.img.addStyle({
				'position': 'fixed', 'top': '50%', 'left': '50%',
				'margin-left': width/-2 + 'px',
				'margin-top': width/-2 + 'px',
				'width': width + 'px',
				'height': width + 'px'
			})
			document.body.appendChild(this.img)
		},
		show: function () {
			this.img.style.display = 'block'
		},
		hide: function () {
			this.img.style.display = 'none'
		}
	}
	Loading.init()
	
	if (typeof exports === 'object') {
		module.exports = Loading
	} else {
		window.Loading = Loading
	}
})(window)
