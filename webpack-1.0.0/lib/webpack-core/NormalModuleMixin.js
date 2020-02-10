var path = require("path"); // TODO refactor
var RawSource = require("webpack-core/lib/RawSource");

function utf8BufferToString(buf) {
  var str = buf.toString("utf-8");
  if(str.charCodeAt(0) === 0xFEFF) {
    return str.substr(1);
  } else {
    return str;
  }
}
function NormalModuleMixin(loaders, resource) {
  this.resource = resource;
  this.loaders = loaders;
  var resourcePath = this.splitQuery(this.resource)[0];
  this.context = resourcePath ? path.dirname(resourcePath) : null;
  // ...
  this._source = null;
}

module.exports = NormalModuleMixin;

NormalModuleMixin.mixin = function (pt) {
  for (var name in NormalModuleMixin.prototype)
    pt[name] = NormalModuleMixin.prototype[name];
};

NormalModuleMixin.prototype.splitQuery = function splitQuery(req) {
  var i = req.indexOf("?");
  if(i < 0) return [req, ""];
  return [req.substr(0, i), req.substr(i)];
};

NormalModuleMixin.prototype.doBuild = function doBuild(options, moduleContext, resolver, fs, callback) {
  var splitQuery = this.splitQuery.bind(this);
  var module = this;

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
  var loaderContext = {
    version: 1,
    context: this.context,
    loaders: loaders,
    // loaderIndex 指向当前 loader
    loaderIndex: 0,
    resource: this.resource,
    resourcePath: splitQuery(this.resource)[0],
    resourceQuery: this.resource ? splitQuery(this.resource)[1] || null : undefined,
    // ...
    inputValue: undefined,
    value: null,
    options: options,
    // ....
  };
  // ....

  /**
   * 遍历 loaders ，引入loader 存放到 loader.module
   * 最后调用 onLoadPitchDone 递归执行所有 loader
   * @param {String} source 源文件内容
   */
  (function loadPitch() {
    var l = loaderContext.loaders[loaderContext.loaderIndex];
    if (!l) {// loader 遍历完毕
      return onLoadPitchDone.call(this);
    }
    if (l.module) {
      loaderContext.loaderIndex++;
      return loadPitch.call(this); // 递归遍历下一个 loader
    }
    if (typeof __webpack_modules__ === "undefined") {
      // ...
      // 将 module 处理方法挂到 loader.module
      l.module = require(l.path);
    }
    // ...
    if (typeof l.module.pitch !== "function") {
      return loadPitch.call(this);
    }
    // ...
  }.call(this))

  function onLoadPitchDone() {
    loaderContext.loaderIndex = loaderContext.loaders.length;
    var request = []
    // ['url-loader','my-url-loader']
    for (var i = 0; i < loaderContext.loaders.length; i++) {
      request.push(loaderContext.loaders[i].request)
    }
    // ['url-loader','my-url-loader', 'xxx.png']
    request.push(loaderContext.resource)
    // 'url-loader!my-url-loader!xxx.png'
    loaderContext.request = request.join("!");
    // resourcePath 为资源绝对路径 /xxx/xxx/xxx.png
    var resourcePath = loaderContext.resourcePath;
    if (resourcePath) {
      // ...
      fs.readFile(resourcePath, nextLoader)
    } else {
      nextLoader(null, null)
    }
  }

  function nextLoader(err/*, paramBuffer1, param2, ...*/) {
    // .....
    var args = Array.prototype.slice.call(arguments, 1);
    // ...
    if (loaderContext.loaderIndex === 0) {// 所有 loader 遍历完毕
      if (Buffer.isBuffer(args[0])) {// 如果是 Buffer
        args[0] = utf8BufferToString(args[0]) // 使用 utf8 编码转换成正常文本，一般是 js
        return onModuleBuild.apply(module, args);
      }
    }
    // loader 指针前移
    loaderContext.loaderIndex--;
    // 准备要执行的 loader
    var l = loaderContext.loaders[loaderContext.loaderIndex];
    // ...
    var privateLoaderContext = Object.create(loaderContext);
    // ...
    privateLoaderContext.inputValue = loaderContext.inputValue;
    privateLoaderContext.query = l.query;
    //
    if (!l.module.raw && Buffer.isBuffer(args[0])) { // 例如 css-loader、style-loader
      args[0] = utf8BufferToString(args[0]);
    } else if (l.module.raw && typeof args[0] === "string") { // 例如 url-loader
      args[0] = new Buffer(args[0], "utf-8");
    }
    // ...
    runSyncOrAsync(l.module, privateLoaderContext, args, function () {
      loaderContext.inputValue = privateLoaderContext.value
      nextLoader.apply(null, arguments);
    })

    /**
     * 执行 loader 处理文件，为了降低理解难度，此处不处理异步 loader
     * @param {Function} fn loader
     * @param {Object} context privateContextLoader
     * @param {Array} args 文件内容
     * @param {Function} callback 执行loader后的回调
     */
    function runSyncOrAsync(fn, context, args, callback) {
      // **** 调用 loader 处理文件 ****
      var result = (function WEBPACK_CORE_LOADER_EXECUTION() {
        return fn.apply(context, args)
      }());

      if (result === undefined) {
        return callback();
      }

      return callback(null, result);
    }
  }

  /**
   * module build 完成回调
   * @param {String} source 源文件内容
   */
  function onModuleBuild(source) {
    // ...
    //*** 这句非常重要，将结果保存到 normalModule._source
    this._source = new RawSource(source);
    return callback()
  }
}
