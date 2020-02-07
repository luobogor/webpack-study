var Compiler = require("./Compiler");
var WebpackOptionsApply = require("./WebpackOptionsApply");

function webpack(options, callback) {
  // ...
  var compiler = new Compiler();
  compiler.options = options;
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
