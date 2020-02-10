var NodeOutputFileSystem = require("./NodeOutputFileSystem");
var NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
var CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");

function NodeEnvironmentPlugin() {}

module.exports = NodeEnvironmentPlugin;

NodeEnvironmentPlugin.prototype.apply = function (compiler) {
  compiler.inputFileSystem = new NodeJsInputFileSystem();
  var inputFileSystem = compiler.inputFileSystem = new CachedInputFileSystem(compiler.inputFileSystem, 60000);
  // 用于输出文件
  compiler.outputFileSystem = new NodeOutputFileSystem();
  // 用于读取文件，如读取 module、读取 loader
  compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
  compiler.resolvers.loader.fileSystem = compiler.inputFileSystem;
  // ...
  compiler.plugin("run", function (compiler, callback) {
    // purge 是清除的意思，下面的语句应该是用来清除缓存的
    if (compiler.inputFileSystem === inputFileSystem) {
      inputFileSystem.purge();
    }
    callback();
  });
}
