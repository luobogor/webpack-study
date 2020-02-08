var Tapable = require("tapable");
var async = require("async");
var Parser = require("./Parser");
var ArrayMap = require("./ArrayMap");
var Module = require("./Module");

function Compilation(compiler) {
  Tapable.call(this);
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
  // .....
  this.chunks = [];
  // .....
  this.modules = [];
  this._modules = {};
  this.cache = null;
  this.records = null;
  // ....
  this.additionalChunkAssets = [];
  this.assets = {};
  this.errors = [];
  this.warnings = [];
  this.children = [];
  this.dependencyFactories = new ArrayMap();
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
            dependencies.forEach(function(dep) {
              dep.module = dependantModule;
              // ...
            });
            // ...
            return callback();
          }
          // ...
          dependencies.forEach(function (dep) {
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
 * @param {Function} onModule 添加 module 之后的回调
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
    // ...
    onModule(module);
    if (result instanceof Module) {
      // ...
    } else {
      this.buildModule(module, function (err) {
        // ...
        moduleReady.call(this);
      })
    }

    function moduleReady() {
      this.processModuleDependencies(module, function (err) {
        if (err) {
          return callback(err);
        }
        return callback(null, module);
      }.bind(this))
    }
  })
}

Compilation.prototype.addEntry = function process(context, entry, name, callback) {
  this._addModuleChain(
    context,
    entry,
    function (module) {
      this.entries.push(module);
      module.id = 0;
    }.bind(this),
    function (err, module) {

    }.bind(this))
}

Compilation.prototype.seal = function seal(callback) {
}

Compilation.prototype.addChunk = function addChunk(name, module, loc) {
}
