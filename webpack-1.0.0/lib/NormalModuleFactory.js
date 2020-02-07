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
