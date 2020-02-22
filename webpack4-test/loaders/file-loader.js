// 根据图片生成一个 md5 发射到 dist 目录下，并且返回当前图片路径
const loaderUtils = require('loader-utils')

function loader(source) {
  // TODO 生成文件路径
  console.log('file-loader.....')
  const filename = loaderUtils.interpolateName(this, '[hash].[ext]', {
    content: source,
  })
  // todo 发射文件的作用是？？
  this.emitFile(filename, source)
  return `module.exports = "${filename}"`
}

loader.raw = true // 使 source 变为 buffer，否则 source 是字符串乱码
module.exports = loader
