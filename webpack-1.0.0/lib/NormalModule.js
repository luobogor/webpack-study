var RawSource = require("webpack-core/lib/RawSource");
var ReplaceSource = require("webpack-core/lib/ReplaceSource");
var Module = require("./Module");
var NormalModuleMixin = require("./webpack-core/NormalModuleMixin");

function NormalModule(request, userRequest, rawRequest, loaders, resource, parser) {
  Module.call(this);
  this.request = request;
  this.userRequest = userRequest;
  this.rawRequest = rawRequest;
  this.parser = parser;
  NormalModuleMixin.call(this, loaders, resource);
  this.assets = {};
  this.built = false;
}

module.exports = NormalModule;

NormalModule.prototype = Object.create(Module.prototype);
NormalModuleMixin.mixin(NormalModule.prototype);

NormalModule.prototype.identifier = function () {
  return this.request;
};

// NormalModuleMixin.prototype.doBuild 会调用这个方法
NormalModule.prototype.fillLoaderContext = function fillLoaderContext(loaderContext, options, compilation) {
  loaderContext.webpack = true;
  // loader 内调用此方法可添加输出资源，比如 file-loader 会使用这个方法
  loaderContext.emitFile = function(name, content, sourceMap) {
    // 缩减代码不考虑使用 sourceMap 的情况
    this.assets[name] = new RawSource(content);
  }.bind(this);
  loaderContext._module = this;
  loaderContext._compilation = compilation;
  loaderContext._compiler = compilation.compiler;
  compilation.applyPlugins("normal-module-loader", loaderContext, this);
};

NormalModule.prototype.build = function build(options, compilation, resolver, fs, callback) {
  this.built = true;
  // NormalModuleMixin.prototype.doBuild
  return this.doBuild(
    options,
    compilation,
    resolver,
    fs,
    function (err) {
      // ...
      this.dependencies.length = 0;
      // ...
      try {
        // doBuild 的结果保存在 this._source
        this.parser.parse(this._source.source(), {
          current: this,
          module: this,
          compilation: compilation,
          options: options
        });
      }catch (e) {
        // ...
      }
      return callback();
    }.bind(this))
}

// FunctionModuleTemplate.render 会调用这个方法用于渲染 function，不用细看
NormalModule.prototype.source = function(dependencyTemplates, outputOptions, requestShortener) {
  if(this._cachedSource) return this._cachedSource;
  var _source = this._source;
  if(!_source) return new RawSource("throw new Error('No source availible');");
  var source = this._cachedSource = new ReplaceSource(_source);
  var topLevelBlock = this;
  function doDep(dep) {
    var template = dependencyTemplates.get(dep.Class);
    if(!template) throw new Error("No template for dependency: " + dep.Class.name);
    template.apply(dep, source, outputOptions, requestShortener, dependencyTemplates);
  }
  function doVariable(vars, variable) {
    var name = variable.name;
    var expr = variable.expressionSource(dependencyTemplates, outputOptions, requestShortener);
    vars.push({name: name, expression: expr});
  }
  function doBlock(block) {
    block.dependencies.forEach(doDep);
    block.blocks.forEach(doBlock);
    if(block.variables.length > 0) {
      var vars = [];
      block.variables.forEach(doVariable.bind(null, vars));
      var varNames = [];
      var varExpressions = [];
      var varStartCode = "";
      var varEndCode = "";
      function emitFunction() {
        if(varNames.length == 0) return;

        varStartCode += "/* WEBPACK VAR INJECTION */(function(require, " + varNames.join(", ") + ") {";
        // exports === this in the topLevelBlock, but exports do compress better...
        varEndCode = (topLevelBlock === block ? "}.call(exports, require, " : "}.call(this, require, ") +
          varExpressions.map(function(e) {return e.source()}).join(", ") + "))" + varEndCode;

        varNames.length = 0;
        varExpressions.length = 0;
      }
      vars.forEach(function(v) {
        if(varNames.indexOf(v.name) >= 0) emitFunction();
        varNames.push(v.name);
        varExpressions.push(v.expression);
      });
      emitFunction();
      var start = block.range ? block.range[0] : 0;
      var end = block.range ? block.range[1] : _source.size();
      if(varStartCode) source.insert(start + 0.5, varStartCode);
      if(varEndCode) source.insert(end + 0.5, "\n/* WEBPACK VAR INJECTION */" + varEndCode);
    }
  }
  doBlock(this);
  return source;
};
