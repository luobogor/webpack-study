const fs = require('fs')
const path = require('path')

class Compiler {
  constructor(config) {
    this.config = config
    this.entryId = ''
    this.modules = {}
    this.entry = config.entry
    this.root = process.cwd()
  }

  getSource(modulePath) {
    const content = fs.readFileSync(modulePath, 'utf-8')
    return content
  }

  parse(source, path) {
    console.log('source:', source)
    console.log('path:', path)
  }

  buildModule(modulePath, isEntry) {
    const source = this.getSource(modulePath)
    // 模块 id = modulePath - this.root
    const moduleName = `./${path.relative(this.root, modulePath)}`

    if(isEntry) {
        this.entryId = moduleName
    }

    // path.dirName(moduleName) 获取父级目录名
    const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
    this.modules[moduleName] = sourceCode
  }

  emitFile() {

  }

  run() {
    this.buildModule(path.resolve(this.root, this.entry), true)
    // 发射打包后的文件
    this.emitFile()
  }
}

module.exports = Compiler
