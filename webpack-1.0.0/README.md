- WebpackOptionsApply 在执行 compiler.run 前先订阅各种事件

### Compiler

### Compilation
#### addEntry
做一系列操作目的是将入口 module 添加到 compilation.entries

#### _addModuleChain、addModuleDependencies
本质上都是调用 factory.create 然后 buildModule，但 addModuleDependencies 是递归的

#### buildModule
将 factory.create 的 module 对象使用 loaders 处理，处理后将文件内容保存到 module._source

### NormalModule

### NormalModuleFactory
#### create
解析：就是将所有文件、loader（包括inline-loader，配置文件loader）相对路径，解析成绝对路径。
然后 new NormalModule(各种绝对路径)

### NormalModuleMixin
