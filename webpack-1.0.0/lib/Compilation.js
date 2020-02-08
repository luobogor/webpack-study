var Tapable = require("tapable");
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
    building.forEach(function(cb) {
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
