var path = require("path"); // TODO refactor

function NormalModuleMixin(loaders, resource) {
  this.resource = resource;
  this.loaders = loaders;
  var resourcePath = this.splitQuery(this.resource)[0];
  this.context = resourcePath ? path.dirname(resourcePath) : null;
  this.fileDependencies = [];
  this.contextDependencies = [];
  this._source = null;
}

module.exports = NormalModuleMixin;

NormalModuleMixin.mixin = function (pt) {
  for (var name in NormalModuleMixin.prototype)
    pt[name] = NormalModuleMixin.prototype[name];
};

NormalModuleMixin.prototype.doBuild = function doBuild(options, moduleContext, resolver, fs, callback) {
  var splitQuery = this.splitQuery.bind(this);
  var module = this;
  this.cacheable = true;

  // Prepare context
  var loaders = [];

  function addLoaderToList(loader) {
    var l = splitQuery(loader);
    loaders.push({
      request: loader,
      path: l[0],
      query: l[1],
      module: null
    });
  }

  this.loaders.forEach(addLoaderToList);
  var loaderContextCacheable;
  var loaderContext = {
    version: 1,
    context: this.context,
    loaders: loaders,
    loaderIndex: 0,
    resource: this.resource,
    resourcePath: splitQuery(this.resource)[0],
    resourceQuery: this.resource ? splitQuery(this.resource)[1] || null : undefined,
    // ...
    cacheable: function (flag) {
      loaderContextCacheable = flag !== false;
    },
    addDependency: function (file) {
      this.fileDependencies.push(file);
    }.bind(this),
    inputValue: undefined,
    value: null,
    options: options,
    // ....
  };
  // ....

  // 为了降低你友 理解难度，此处不处理异步情况
  function runSyncOrAsync(fn, context, args, callback) {
    var isSync = true;
    // ...
    try {
      // 调用 loader 处理文件
      var result = (function WEBPACK_CORE_LOADER_EXECUTION() {
        return fn.apply(context, args)
      }());
      if (isSync) {
        if (result === undefined) {
          return callback();
        }
        return callback(null, result);
      }
    } catch (e) {
      // ...
    }
  }

  // Load and pitch loaders
  (function loadPitch() {
    // ...
    var l = loaderContext.loaders[loaderContext.loaderIndex];
    if (!l) {
      return onLoadPitchDone.call(this);
    }
    // ...
  }.call(this))


  function onLoadPitchDone() {

  }
}
