var LoaderDependency = require("./LoaderDependency");

function LoaderPlugin() {}
module.exports = LoaderPlugin;

LoaderPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compilation", function(compilation, params) {
    var normalModuleFactory = params.normalModuleFactory;

    compilation.dependencyFactories.set(LoaderDependency, normalModuleFactory);
  });

  compiler.plugin("compilation", function(compilation) {

  })
}
