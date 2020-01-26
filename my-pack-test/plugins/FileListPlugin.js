class FileListPlugin {
  constructor({ filename }) {
    this.filename = filename
  }

  apply(compiler) {
    compiler.hooks.emit.tap('FileListPlugin',(compilation)=> {
      const { assets } = compilation
      let content = `## 文件名  资源大小\r\n`
      Object.entries(assets).forEach(([filename, stateObj])=> {
        content += `- ${filename}    ${stateObj.size()}\r\n`
      })
      // 资源对象
      assets[this.filename] = {
        source() {
          return content
        },
        size() {
          return content.length
        }
      }
    })
  }
}

module.exports = FileListPlugin
