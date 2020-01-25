// const loaderUtils = require('loader-utils')

function loader(source) {
  // 获取 options
  // const options = loaderUtils.getOptions(this)
  const callback = this.async();
  console.log('async loader start.....')
  setTimeout(()=> {
    console.log('async loader end.....')
    callback(null ,source)
  }, 200)
}

module.exports = loader
