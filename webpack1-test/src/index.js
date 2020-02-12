require('./index.less')
const inlineText = require('../loaders/test-inline-loader!./inline-text.txt')

const bigImg = require('./big.png')
const smallImg = require('./small.png')
const a = require('./a')

console.log('index:', a)

const imgTag1 = document.createElement('img')
const imgTag2 = document.createElement('img')
imgTag1.src = smallImg
imgTag2.src = bigImg
document.body.appendChild(imgTag1)
document.body.appendChild(imgTag2)
