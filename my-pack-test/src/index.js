require('./index.less')
const img = require('./small.png')
const a = require('./a')

console.log('index:', a)
const imgTag = document.createElement('img')
imgTag.src = img
document.body.appendChild(imgTag)
