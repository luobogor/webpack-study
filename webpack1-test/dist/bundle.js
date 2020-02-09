/******/ (function(modules) { // webpackBootstrap
/******/ 	// shortcut for better minimizing
/******/ 	var exports = "exports";
/******/ 	
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function require(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId][exports];
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module[exports], module, module[exports], require);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 		
/******/ 		// Return the exports of the module
/******/ 		return module[exports];
/******/ 	}
/******/ 	
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	require.modules = modules;
/******/ 	
/******/ 	// expose the module cache
/******/ 	require.cache = installedModules;
/******/ 	
/******/ 	// __webpack_public_path__
/******/ 	require.p = "";
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return require(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, require) {

	// require('./index.less')
	const bigImg = require(!(function webpackMissingModule() { throw new Error("Cannot find module \"./big.png\""); }()))
	const smallImg = require(!(function webpackMissingModule() { throw new Error("Cannot find module \"./small.png\""); }()))
	const a = require(3)

	console.log('index:', a)

	const imgTag1 = document.createElement('img')
	const imgTag2 = document.createElement('img')
	imgTag1.src = smallImg
	imgTag2.src = bigImg
	document.body.appendChild(imgTag1)
	document.body.appendChild(imgTag2)


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, require) {

	// 前置 -! 不让文件执行 pre、normal loader
	// 前置 ! 不让文件执行 normal loader
	// 前置 !! 只执行行内 loader，其他 loader 都不执行
	// 后置 ! 执行行内 loader
	// const b = require('!!inline-loader!./base/b')

	module.exports = 'a'

	// loader 分为 pitch loader、normal loader


/***/ }
/******/ ])