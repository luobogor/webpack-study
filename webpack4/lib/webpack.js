const WebpackOptionsApply = require("./WebpackOptionsApply");
const Compiler = require("./Compiler");
// var WebpackOptionsDefaulter = require("./WebpackOptionsDefaulter");
// const NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");

function webpack(options, callback) {
  // 设置默认参数
  // new WebpackOptionsDefaulter().process(options);
  var compiler = new Compiler();
  compiler.options = options;
  // new NodeEnvironmentPlugin({
  //   infrastructureLogging: options.infrastructureLogging
  // }).apply(compiler);

  // 执行开发者自定义配置的插件
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === "function") {
        plugin.call(compiler, compiler);
      } else {
        plugin.apply(compiler);
      }
    }
  }

  // compiler.hooks.environment.call();
  // compiler.hooks.afterEnvironment.call();
  compiler.options = new WebpackOptionsApply().process(options, compiler);

  if(callback) {
    // ....
    compiler.run(callback);
  }
  return compiler;
}
exports = module.exports = webpack;
// ...
webpack.Compiler = Compiler;
