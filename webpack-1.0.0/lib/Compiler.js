var Tapable = require("tapable");
var Compilation = require("./Compilation");
// enhanced 是增强的意思
var Resolver = require("enhanced-resolve/lib/Resolver");
var Parser = require("webpack/lib/Parser");
var NormalModuleFactory = require("./NormalModuleFactory");

function Compiler() {
  Tapable.call(this);
  this.mainTemplate = this.chunkTemplate = this.moduleTemplate = null;

  this.outputPath = "";
  this.outputFileSystem = null;
  this.inputFileSystem = null;
  //....

  // 作用未知
  this.resolvers = {
    normal: new Resolver(null),
    loader: new Resolver(null),
  };
  this.parser = new Parser();

  this.options = {};
}

module.exports = Compiler;

// 继承 Tapable
Compiler.prototype = Object.create(Tapable.prototype);

Compiler.prototype.run = function (callback) {
  var startTime = new Date().getTime();
  // 触发 run 异步勾子
  this.applyPluginsAsync("run", this, function (err) {
    // ...
    this.compile(function (err, compilation) {
      // 编译结束，进行文件输出
      this.emitAssets(compilation, function (err) {
        // ...
        var stats = compilation.getStats();
        // 记录花费时间
        stats.startTime = startTime;
        stats.endTime = new Date().getTime();
        // 触发打包结束勾子
        this.applyPlugins("done", stats);
        return callback(null, stats);
      }.bind(this))
    }.bind(this))
  }.bind(this))
}

/**
 * 编译
 * @param {Function} callback compile结束回调
 */
Compiler.prototype.compile = function (callback) {
  var params = this.newCompilationParams();
  this.applyPlugins("compile", params);
  var compilation = this.newCompilation(params);
  this.applyPluginsParallel("make", compilation, function (err) {
    // ...
    compilation.seal(function (err) {
      // ...
      this.applyPluginsAsync("after-compile", compilation, function (err) {
        // ...
        return callback(null, compilation);
      });
    }.bind(this))
  }.bind(this));
}

Compiler.prototype.createCompilation = function () {
  return new Compilation(this);
};

/**
 * 创建 Compilation 实例
 * @param {Object} params { normalModuleFactory: NormalModuleFactory}
 * @return {Compilation}
 */
Compiler.prototype.newCompilation = function (params) {
  var compilation = this.createCompilation();
  // ...
  compilation.name = this.name;
  // 创建 compilation 对象之后触发 compilation 勾子
  // CommonJsPlugin、SingleEntryPlugin 等对象监听这个勾子
  // 然后调用 compilation.dependencyFactories.set(dependent, factory) 在 dependencyFactories 里存放不同类型的工厂
  this.applyPlugins("compilation", compilation, params);
  return compilation;
};

Compiler.prototype.createNormalModuleFactory = function () {
  var normalModuleFactory = new NormalModuleFactory(this.options.context, this.resolvers, this.parser, this.options.module || {});
  this.applyPlugins("normal-module-factory", normalModuleFactory);
  return normalModuleFactory;
};

Compiler.prototype.newCompilationParams = function () {
  var params = {
    normalModuleFactory: this.createNormalModuleFactory(),
  };
  return params;
}

Compiler.prototype.emitAssets = function (compilation, callback) {
  this.applyPluginsAsync("emit", compilation, function (err) {
    // emit 勾子，最后一次 compilation.assets的机会
    // mkdirp 是第三方库，用于创建一个不存在的目录下的子目录，也就是级联创建目录
    this.outputFileSystem.mkdirp(this.outputPath, emitFiles.bind(this));
  }.bind(this));

  function emitFiles(err) {
    // ...
    var async = require("async")
    async.forEach(
      Object.keys(compilation.assets),
      function (file, callback) {
        // ...
        // 省略处理输出路径代码
        writeOut.call(this);

        function writeOut(err) {
          if (err) {
            return callback(err);
          }
          var targetPath = this.outputFileSystem.join(this.outputPath, file);
          var source = compilation.assets[file];
          if (source.existsAt === targetPath) {// 这个 if 的作用是 ？？
            source.emitted = false;
            return callback();
          }
          // content 为输出的 bundle 的内容文本
          var content = source.source();
          if (!Buffer.isBuffer(content)) {
            content = new Buffer(content, "utf-8");
          }
          source.existsAt = targetPath;
          source.emitted = true;
          this.outputFileSystem.writeFile(targetPath, content, callback);
        }
      }.bind(this),
      function (err) { // async callback
        if (err) return callback(err);

        afterEmit.call(this);
      }.bind(this))

  }

  function afterEmit() {
    this.applyPluginsAsync("after-emit", compilation, function (err) {
      if (err) {
        return callback(err);
      }
      return callback();
    });
  }
}
