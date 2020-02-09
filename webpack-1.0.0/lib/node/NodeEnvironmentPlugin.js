var NodeOutputFileSystem = require("./NodeOutputFileSystem");

function NodeEnvironmentPlugin() {}
module.exports = NodeEnvironmentPlugin;

NodeEnvironmentPlugin.prototype.apply = function(compiler) {
  // ...
  compiler.outputFileSystem = new NodeOutputFileSystem();
  // ...
}
