const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const ejs = require('ejs')

class Compiler {
  constructor(config) {
    this.config = config
    this.entryId = ''
    this.modules = {}
    this.entry = config.entry
    this.root = process.cwd()
  }

  getSource(modulePath) {
    let { rules } = this.config.module
    let content = fs.readFileSync(modulePath, 'utf-8')
    rules.forEach(({ test, use }) => {
      if (test.test(modulePath)) {
        content = use.slice().reverse().reduce((res, loaderPath)=> {
          const loader = require(loaderPath)
          return loader(res)
        }, content)
      }
    })
    return content
  }

  parse(source, parentPath) {
    const ast = babylon.parse(source)
    const dependencies = []
    traverse(ast, {
      CallExpression(p) {
        const { node } = p
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduleName = node.arguments[0].value
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')
          moduleName = `./${path.join(parentPath, moduleName)}`
          dependencies.push(moduleName)
          node.arguments = [t.stringLiteral(moduleName)]
        }
      }
    })

    const sourceCode = generator(ast).code

    return {
      sourceCode,
      dependencies,
    }
  }

  buildModule(modulePath, isEntry) {
    const source = this.getSource(modulePath)
    // 模块 id = modulePath - this.root
    const moduleName = `./${path.relative(this.root, modulePath)}`

    if (isEntry) {
      this.entryId = moduleName
    }

    // path.dirName(moduleName) 获取父级目录名
    const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
    this.modules[moduleName] = sourceCode

    dependencies.forEach((dep) => {
      this.buildModule(path.join(this.root, dep), false)
    })
  }

  emitFile() {
    const main = path.join(this.config.output.path, this.config.output.filename)
    const templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    const code = ejs.render(templateStr, {
      entryId: this.entryId,
      modules: this.modules,
    })
    this.assets = {
      [main]: code
    }
    console.log(this.assets)
    fs.writeFileSync(main, this.assets[main])
  }

  run() {
    this.buildModule(path.resolve(this.root, this.entry), true)
    // 发射打包后的文件
    this.emitFile()
  }
}

module.exports = Compiler
