var async = require("async");

var Tapable = require("tapable");
var NormalModule = require("./NormalModule");
var LoadersList = require("webpack-core/lib/LoadersList");

function NormalModuleFactory(context, resolvers, parser, options) {
  Tapable.call(this);
  this.resolvers = resolvers;
  this.parser = parser;
  this.loaders = new LoadersList(options.loaders);
  // 暂时不考虑 preLoaders、postLoaders
  // this.preLoaders = new LoadersList(options.preLoaders);
  // this.postLoaders = new LoadersList(options.postLoaders);
  this.context = context || "";
}

module.exports = NormalModuleFactory;

NormalModuleFactory.prototype = Object.create(Tapable.prototype);

NormalModuleFactory.prototype.create = function (context, dependency, callback) {
  context = context || this.context;
  var request = dependency.request;

  this.applyPluginsAsyncWaterfall(
    "before-resolve",
    {
      context: context,
      request: request
    },
    function (err, result) {
      // 一般情况下 result 还是这个对象
      // {
      //   context: context,
      //   request: request
      // },

      context = result.context;
      request = result.request;

      var noAutoLoaders = /^-?!/.test(request);
      var noPrePostAutoLoaders = /^!!/.test(request);
      var noPostAutoLoaders = /^-!/.test(request);
      var elements = request.replace(/^-?!+/, "").replace(/!!+/g, "!").split("!");
      // 要请求的源文件，比如 require('url-loader!test.png')
      // 那么 resource 就是 'test.png'
      var resource = elements.pop();

      async.parallel(
        [// async tasks
          function (callback) {// task 1，返回 results[0]
            this.resolveRequestArray(context, elements, this.resolvers.loader, callback)
          }.bind(this),
          function (callback) {// task 2，返回 results[1]
            if (resource == "" || resource[0] == "?") {
              return callback(null, resource);
            }
            // 解析 module 路径
            // compiler.resolvers.normal.resolve 能正常使用的条件
            // - WebpackOptionsDefaulter 添加环境默认参数
            // - WebpackOptionsApply, compiler.resolvers.normal.apply 使用解析路径相关插件
            // - NodeEnvironmentPlugin 添加 inputFileSystem、outputFileSystem
            this.resolvers.normal.resolve(context, resource, callback);
          }.bind(this)
        ],
        function (err, results) {// async callback
          var loaders = results[0];
          resource = results[1];
          var userRequest = loaders.concat([resource]).join("!");

          if (noPrePostAutoLoaders) {
            // ...
            // return
          }

          if (noAutoLoaders) {
            //...
          } else {
            async.parallel(
              [
                // postloader
                this.resolveRequestArray.bind(this, context, this.loaders.match(resource), this.resolvers.loader)
                // preloader
              ],
              function (err, results) {
                // 按 pre normal post 的顺序排列好 loader
                // loaders = results[0].concat(loaders).concat(results[1]).concat(results[2]);
                loaders = results[0].concat(loaders)
                onDoneResolving.call(this);
              }.bind(this))
          }

          function onDoneResolving() {
            this.applyPluginsAsyncWaterfall(
              "after-resolve",
              {
                request: loaders.concat([resource]).join("!"),
                userRequest: userRequest,
                rawRequest: request,
                loaders: loaders,
                resource: resource,
                parser: this.parser
              },
              function (err, result) {
                // ....

                return callback(
                  null,
                  new NormalModule(
                    result.request,
                    result.userRequest,
                    result.rawRequest,
                    result.loaders,
                    result.resource,
                    result.parser
                  )
                )
              })
          }
        }.bind(this)) // async parallel callback
    }.bind(this))// before-resolve callback
}

// arr 是配置项中的 ['url-loader']
// {
//    loader: 'url-loader'
// }
NormalModuleFactory.prototype.resolveRequestArray = function resolveRequestArray(context, array, resolver, callback) {
  if (array.length === 0) {
    return callback(null, []);
  }
  // async.map 只要有一个任务结束就会调用 callback
  async.map(array, function (item, callback) {
    if (item == "" || item[0] == "?") {
      return callback(null, item);
    }
    // compiler.loader.resolve 将相对路径解析成绝对路径，callback 返回这个绝对路径
    resolver.resolve(context, item, callback);
  }, callback)
}
