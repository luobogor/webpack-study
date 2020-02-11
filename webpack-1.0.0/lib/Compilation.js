var Tapable = require("tapable");
var async = require("async");
var ArrayMap = require("./ArrayMap");
var Module = require("./Module");
var Chunk = require("./Chunk");
var Template = require("./Template");

function Compilation(compiler) {
  Tapable.call(this);
  this.compiler = compiler;
  this.mainTemplate = compiler.mainTemplate;
  this.chunkTemplate = compiler.chunkTemplate;
  // .....
  this.moduleTemplate = compiler.moduleTemplate;
  this.resolvers = compiler.resolvers;
  this.inputFileSystem = compiler.inputFileSystem;
  // .....
  var options = this.options = compiler.options;
  this.outputOptions = options && options.output;
  this.entries = [];
  // 所有 module build 完成后将入口 module 放到 preparedChunks
  this.preparedChunks = [];
  // .....
  this.chunks = [];
  // 以 name 为 key
  this.namedChunks = {};
  this.modules = [];
  // 以 request 为 key
  this._modules = {};
  // id 增加器
  this.nextFreeModuleId = 1;
  this.nextFreeChunkId = 0;
  // ....
  this.assets = {};
  // ...
  this.dependencyFactories = new ArrayMap();
  // compilation.dependencyTemplates.set(CommonJsRequireDependency, new CommonJsRequireDependency.Template()); .....
  this.dependencyTemplates = new ArrayMap();
}

module.exports = Compilation;
Compilation.prototype = Object.create(Tapable.prototype);

Compilation.prototype.getModule = function (module) {
  var identifier = module.identifier();
  return this._modules[identifier];
};

/**
 * 向 modules、_modules 中添加 module
 * @param {Module} module
 * @return {Boolean}
 */
Compilation.prototype.addModule = function (module, cacheGroup) {
  // cacheGroup = cacheGroup || "m";
  var identifier = module.identifier();
  if (this._modules[identifier]) {
    return false
  }

  // 省略 this.cache 判断 ...

  this._modules[identifier] = module;
  this.modules.push(module);
  return true;
}

Compilation.prototype.buildModule = function (module, thisCallback) {
  this.applyPlugins("build-module", module);
  var building = module.building = [thisCallback];

  function callback(err) {
    module.building = undefined;
    building.forEach(function (cb) {
      cb(err);
    });
  }

  module.build(
    this.options,
    this,
    this.resolvers.normal,
    this.inputFileSystem,
    function (err) {
      // ....
      this.applyPlugins("succeed-module", module);
      return callback();
    }.bind(this)
  );
}

Compilation.prototype.processModuleDependencies = function (module, callback) {
  var dependencies = [];

  function addDependency(dep) {
    for (var i = 0; i < dependencies.length; i++) {// todo 问题：将重复的依赖归到一组 ？？
      if (dep.isEqualResource(dependencies[i][0])) {
        return dependencies[i].push(dep);
      }
    }
    dependencies.push([dep])
  }

  function addDependenciesBlock(block) {
    if (block.dependencies) {
      block.dependencies.forEach(addDependency)
    }
    // ....
  }

  addDependenciesBlock(module);
  this.addModuleDependencies(module, dependencies, this.bail, null, true, callback);
}

Compilation.prototype.addModuleDependencies = function (module, dependencies, bail, cacheGroup, recursive, callback) {
  var factories = [];
  for (var i = 0; i < dependencies.length; i++) {
    var factory = this.dependencyFactories.get(dependencies[i][0].Class);
    if (!factory) {
      return callback(new Error("No module factory availible for dependency type: " + dependencies[i][0].Class.name));
    }
    factories[i] = [factory, dependencies[i]];
  }

  async.forEach(
    factories,
    function (item, callback) {
      var dependencies = item[1];
      // ...
      var factory = item[0];
      // ...
      factory.create(
        module.context,
        dependencies[0],
        function (err, dependantModule) { // dependantModule 是由 factory 创建的 module
          // ...
          if (!dependantModule) {
            return callback();
          }
          // ...
          var newModule = this.addModule(dependantModule, cacheGroup);

          if (!newModule) {
            dependantModule = this.getModule(dependantModule);
            // ...
            dependencies.forEach(function (dep) {
              // 赋值 Dependency.module
              dep.module = dependantModule;
              // ...
            });
            // ...
            return callback();
          }
          // ...
          dependencies.forEach(function (dep) {
            // 赋值 Dependency.module
            dep.module = dependantModule
            // ...
          })

          this.buildModule(dependantModule, function (err) {
            // ...
            if (recursive) {
              this.processModuleDependencies(dependantModule, callback)
            } else {
              return callback()
            }
          }.bind(this))

        }.bind(this))
    }.bind(this),
    function (err) {
      // ...
      return callback();
    })
}
/**
 * 从入口 module 开始递归创建所有 module
 * @param {String} context options.context
 * @param {String} dependency 依赖的文件路径
 * @param {Function} onModule 添加入口 module 之后的回调
 * @param {Function} callback 所有 module 创建完成的回调
 */
Compilation.prototype._addModuleChain = function process(context, dependency, onModule, callback) {
  // 如果 dependency 是 SingleEntryDependency 的实例，那么 moduleFactory 是 NormalModuleFactory
  var moduleFactory = this.dependencyFactories.get(dependency.Class);

  moduleFactory.create(context, dependency, function (err, module) {
    // ...
    // 没 cache 的情况下 result 是 Boolean 值
    var result = this.addModule(module);
    if (!result) { // 如果 module 已经被添加过
      module = this.getModule(module);
      onModule(module)
      return callback(null, module)
    }
    // // ...
    onModule(module);
    if (result instanceof Module) {
      // ...
    } else {
      this.buildModule(module, function (err) {
        // ...
        moduleReady.call(this);
      }.bind(this))
    }
    //
    function moduleReady() {
      this.processModuleDependencies(module, function (err) {
        if (err) {
          return callback(err);
        }
        return callback(null, module);
      }.bind(this))
    }
  }.bind(this))
}

Compilation.prototype.addEntry = function process(context, entry, name, callback) {
  this._addModuleChain(
    context,
    entry,
    function (module) {// 入口 module 创建完成回调
      this.entries.push(module);
      module.id = 0;
    }.bind(this),
    function (err, module) { // 这个 module 也是入口 module
      // ...
      if (module) {
        this.preparedChunks.push({
          name: name,
          module: module,
        })
      }
      return callback();
    }.bind(this))
}

Compilation.prototype.seal = function seal(callback) {
  this.applyPlugins("seal");
  this.preparedChunks.forEach(function (preparedChunk) {
    var module = preparedChunk.module;
    var chunk = this.addChunk(preparedChunk.name, module);
    chunk.initial = chunk.entry = true;
    chunk.addModule(module);
    module.addChunk(chunk);
    this.processDependenciesBlockForChunk(module, chunk);
  }, this);
  // ...
  // 以下两个同步勾子用于分割 chunks，CommonJsChunkPlugin 处理
  this.applyPlugins("optimize-chunks", this.chunks);
  this.applyPlugins("after-optimize-chunks", this.chunks);
  // ...
  this.applyPluginsAsyncSeries(
    "optimize-tree",
    this.chunks,
    this.modules,
    function (err) {
      // ...
      this.applyModuleIds();
      // ...
      this.applyChunkIds();
      // ...
      this.sortItems();
      // ...
      this.createHash();
      // *** 重点 ***
      this.createChunkAssets();
      // ...
      callback()
      //...
    }.bind(this))
}

Compilation.prototype.addChunk = function addChunk(name, module, loc) {
  // ...
  var chunk = new Chunk(name, module, loc);
  this.chunks.push(chunk);
  if (name) {
    this.namedChunks[name] = chunk;
  }
  return chunk;
}

/**
 * 从入口 module 开始，递归将依赖的 module 加入到同一个 chunk
 * @param {Module} block
 * @param {Chunk} chunk
 */
Compilation.prototype.processDependenciesBlockForChunk = function processDependenciesBlockForChunk(block, chunk) {
  function iteratorDependency(d) {
    if (!d.module) {
      return;
    }
    // ...
    if (chunk.addModule(d.module)) {
      d.module.addChunk(chunk)
      this.processDependenciesBlockForChunk(d.module, chunk);
    }
  }

  block.dependencies.forEach(iteratorDependency, this);
}

Compilation.prototype.applyModuleIds = function applyModuleIds() {
  this.modules.forEach(function (module) {
    if (module.id === null) {
      module.id = this.nextFreeModuleId++;
    }
  }, this);
};

Compilation.prototype.applyChunkIds = function applyChunkIds() {
  this.chunks.forEach(function (chunk) {
    if (chunk.id === null) {
      if (chunk.id === null)
        chunk.id = this.nextFreeChunkId++;
    }
    if (!chunk.ids)
      chunk.ids = [chunk.id];
  }, this);
};

/**
 *  按 id 升序排序
 */
Compilation.prototype.sortItems = function sortItems() {
  function byId(a, b) {
    return a.id - b.id;
  }

  this.chunks.sort(byId);
  this.modules.sort(byId);
  this.modules.forEach(function (module) {
    module.chunks.sort(byId);
    // ...
  });
  this.chunks.forEach(function (chunk) {
    chunk.modules.sort(byId);
  });
};

/**
 *  为每个 chunk 分配 hash
 */
Compilation.prototype.createHash = function createHash() {
  // 模拟 hash
  this.hash = Date.now()
}

/**
 *  渲染，将结果保存在 compilation.assets
 */
Compilation.prototype.createChunkAssets = function createChunkAssets() {
  var outputOptions = this.outputOptions;
  var filename = outputOptions.filename || "bundle.js";
  var chunkFilename = outputOptions.chunkFilename || "[id]." + filename.replace(Template.REGEXP_NAME, "");
  // var namedChunkFilename = outputOptions.namedChunkFilename || null;
  // ...
  for (var i = 0; i < this.chunks.length; i++) {
    var chunk = this.chunks[i];
    chunk.files = [];
    var source;
    var file;
    // 一般情况下 filenameTemplate 为 'bundle.js'
    var filenameTemplate = chunk.filenameTemplate ? chunk.filenameTemplate :
      chunk.initial ? filename :
        chunkFilename;

    try {
      if (chunk.entry) {// 渲染入口 chunk，比如 runtime chunk
        // ....
        // *** 重点
        // source 是一个 ConcatSource 实例
        // this.mainTemplate - JsonMainTemplate, JsonTemplatePlugin 注册
        // this.moduleTemplate - FunctionModuleTemplate
        source = this.mainTemplate.render(this.hash, chunk, this.moduleTemplate, this.dependencyTemplates);
        // ...
      } else {// 渲染非入口 chunk
        // ...
        // this.chunkTemplate - JsonChunkTemplate, JsonTemplatePlugin 注册
        source = this.chunkTemplate.render(chunk, this.moduleTemplate, this.dependencyTemplates);
        // ...
      }
      // ...
    }catch (e) {
      console.error(e)
    }

    this.assets[file = filenameTemplate] = source;
    chunk.files.push(file);
    this.applyPlugins("chunk-asset", chunk, file);
    // ...
  }
}

Compilation.prototype.getStats = function () {
  // return new Stats(this);
  return {}
};
