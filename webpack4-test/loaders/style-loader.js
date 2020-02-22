const loaderUtils = require('loader-utils')

function loader(source) {
  // console.log('style-loader.....')
  // const style = `
  //   const style = document.createElement('style')
  //   style.innerHTML = ${JSON.stringify(source)}
  //   document.head.appendChild(style)
  // `
  // return style
}

// style-loader写了pitch,有返回后面的跳过，自己的写不会走
loader.pitch = function (remainingRequest) {  // 剩余的请求
  console.log('style-loader.pitch.....', loaderUtils.stringifyRequest(this, '!!' + remainingRequest))
  // loaderUtils.stringifyRequest 将绝对路请求转换成相对路径请求
  let str = `
    let style = document.createElement('style')
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)})
    document.head.appendChild(style)
   `
  // stringifyRequest 绝对路径转相对路径
  return str
}

module.exports = loader
