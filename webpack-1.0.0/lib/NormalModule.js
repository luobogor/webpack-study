var RawSource = require("webpack-core/lib/RawSource");
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
