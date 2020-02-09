webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, require) {

	// require('./index.less')
	const bigImg = require(2)
	const smallImg = require(3)
	const a = require(1)

	console.log('index:', a)

	const imgTag1 = document.createElement('img')
	const imgTag2 = document.createElement('img')
	imgTag1.src = smallImg
	imgTag2.src = bigImg
	document.body.appendChild(imgTag1)
	document.body.appendChild(imgTag2)


/***/ }
])