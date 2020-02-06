var Tapable = require("tapable");
var Parser = require("./Parser");

function Compilation(compiler) {
  Tapable.call(this);
  Tapable.call(this);
  this.compiler = compiler;
  this.mainTemplate = compiler.mainTemplate;
  this.chunkTemplate = compiler.chunkTemplate;
  // .....
  this.moduleTemplate = compiler.moduleTemplate;
  this.resolvers = compiler.resolvers;
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

Compilation.prototype.buildModule = function(module, thisCallback) {

}

Compilation.prototype._addModuleChain = function process(context, dependency, onModule, callback) {

}

Compilation.prototype.addEntry = function process(context, entry, name, callback) {
  this._addModuleChain(context, entry, function(module) {})
}

Compilation.prototype.seal = function seal(callback) {
}

Compilation.prototype.addChunk = function addChunk(name, module, loc) {
}
