var Compiler = require("./Compiler");

function webpack(options, callback) {
  // ...
  var compiler = new Compiler();
  compiler.options = options;
  // ...
  if(callback) {
    // ....
    compiler.run(callback);
  }
  return compiler;
}
exports = module.exports = webpack;
// ...
webpack.Compiler = Compiler;
