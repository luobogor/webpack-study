/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var OptionsDefaulter = require("webpack-core/lib/OptionsDefaulter");

function WebpackOptionsDefaulter() {
  OptionsDefaulter.call(this);
  this.set("debug", false);
  this.set("devtool", false);
  // 设置 context 执行 webpack 的目录
  this.set("context", process.cwd());
  // 设置 { target: 'web' }
  this.set("target", "web");
  this.set("output", {});
  this.set("node", {});
  this.set("resolve", {});
  this.set("resolveLoader", {});

  this.set("output.libraryTarget", "var");
  this.set("output.path", "");
  this.set("output.sourceMapFilename", "[file].map");
  this.set("output.hotUpdateChunkFilename", "[id].[hash].hot-update.js");
  this.set("output.hotUpdateMainFilename", "[hash].hot-update.json");
  this.set("output.hashFunction", "md5");
  this.set("output.hashDigest", "hex");
  this.set("output.hashDigestLength", 20);
  this.set("output.sourcePrefix", "\t");

  this.set("node.console", false);
  this.set("node.process", true);
  this.set("node.global", true);
  this.set("node.buffer", true);
  this.set("node.__filename", "mock");
  this.set("node.__dirname", "mock");

  this.set("resolve.fastUnsafe", []);
  this.set("resolveLoader.fastUnsafe", []);

  this.set("resolve.alias", {});
  this.set("resolveLoader.alias", {});

  this.set("optimize.occurenceOrderPreferEntry", true);
}

module.exports = WebpackOptionsDefaulter;

WebpackOptionsDefaulter.prototype = Object.create(OptionsDefaulter.prototype);

WebpackOptionsDefaulter.prototype.constructor = WebpackOptionsDefaulter;

WebpackOptionsDefaulter.prototype.process = function (options) {
  OptionsDefaulter.prototype.process.call(this, options);

  if (options.resolve.packageAlias === undefined) {
    if (options.target === "web" || options.target === "webworker")
      options.resolve.packageAlias = "browser";
  }

  function defaultByTarget(value, web, webworker, node, def) {
    if (value !== undefined) {
      return value;
    }
    switch (options.target) {
      case "web":
        return web;
      case "webworker":
        return webworker;
      case "node":
      case "async-node":
        return node;
      default:
        return def;
    }
  }

  // 为了方便理解，只保留 web 环境参数
  options.resolve.modulesDirectories = defaultByTarget(options.resolve.modulesDirectories,
    ["web_modules", "node_modules"],// ...
  );

  options.resolveLoader.modulesDirectories = defaultByTarget(options.resolveLoader.modulesDirectories,
    ["web_loaders", "web_modules", "node_loaders", "node_modules"],//...
  );

  options.resolve.packageMains = defaultByTarget(options.resolve.packageMains,
    ["webpack", "browser", "web", "browserify", ["jam", "main"], "main"],//...
  );

  options.resolve.packageAlias = defaultByTarget(options.resolve.packageAlias,
    "browser",//...
  );

  options.resolveLoader.packageMains = defaultByTarget(options.resolveLoader.packageMains,
    ["webpackLoader", "webLoader", "loader", "main"],// ...
  );

  options.resolve.extensions = defaultByTarget(options.resolve.extensions,
    ["", ".webpack.js", ".web.js", ".js"],//...
  );

  options.resolveLoader.extensions = defaultByTarget(options.resolveLoader.extensions,
    ["", ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"], // ...
  );

  options.resolveLoader.moduleTemplates = defaultByTarget(options.resolveLoader.moduleTemplates,
    ["*-webpack-loader", "*-web-loader", "*-loader", "*"], //...
  );
};
