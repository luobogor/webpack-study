var async = require("async");

var Tapable = require("tapable");
var LoadersList = require("webpack-core/lib/LoadersList");

function NormalModuleFactory(context, resolvers, parser, options) {
  Tapable.call(this);
  this.resolvers = resolvers;
  this.parser = parser;
  this.loaders = new LoadersList(options.loaders);
  this.preLoaders = new LoadersList(options.preLoaders);
  this.postLoaders = new LoadersList(options.postLoaders);
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
      //     request: request
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
          function (callback) {// task 1
            this.resolveRequestArray(context, elements, this.resolvers.loader, callback)
          }.bind(this)
          // task2 ...
        ],
        function (err, results) {// async callback
          var loaders = results[0];
          resource = results[1];

        })
    }.bind(this))
}

NormalModuleFactory.prototype.resolveRequestArray = function resolveRequestArray(context, array, resolver, callback) {
  if (array.length === 0) {
    return callback(null, []);
  }
  // async.map 只要有一个任务结束就会调用 callback
  async.map(array, function (item, callback) {
    if (item == "" || item[0] == "?") {
      return callback(null, item);
    }
    // loader.resolve
    resolver.resolve(context, item, callback);
  }, callback)
}
