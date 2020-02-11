var WebpackOptionsApply = require("./WebpackOptionsApply");
var Compiler = require("./Compiler");
var WebpackOptionsDefaulter = require("./WebpackOptionsDefaulter");
var NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");

function webpack(options, callback) {
  // 设置默认参数
  new WebpackOptionsDefaulter().process(options);
  var compiler = new Compiler();
  compiler.options = options;
  compiler.options = new WebpackOptionsApply().process(options, compiler);
  new NodeEnvironmentPlugin().apply(compiler);
  if(callback) {
    // ....
    compiler.run(callback);
  }
  return compiler;
}
exports = module.exports = webpack;
// ...
webpack.Compiler = Compiler;
