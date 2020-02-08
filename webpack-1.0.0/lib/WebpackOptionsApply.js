var FunctionModulePlugin = require("./FunctionModulePlugin");
var SingleEntryPlugin = require("./SingleEntryPlugin");
var LoaderPlugin = require("./dependencies/LoaderPlugin");

// var CommonJsPlugin = require("./dependencies/CommonJsPlugin");

function WebpackOptionsApply() {
  OptionsApply.call(this);
}

module.exports = WebpackOptionsApply;

WebpackOptionsApply.prototype.process = function (options, compiler) {
  // 执行用户自定义的 plugins
  compiler.context = options.context;
  if (options.plugins && Array.isArray(options.plugins)) {
    compiler.apply.apply(compiler, options.plugins);
  }
  compiler.outputPath = options.output.path;

  switch (options.target) {
    case "web":
      var JsonpTemplatePlugin = require("./JsonpTemplatePlugin");
      // var NodeSourcePlugin = require("./node/NodeSourcePlugin");
      compiler.apply(
        new JsonpTemplatePlugin(options.output),
        new FunctionModulePlugin(options.output),
        // new NodeSourcePlugin(options.node)
      );
      break;
  }
  // 执行内置 plugins
  // ...
  // 所有 plugins 执行后调用 after-plugins 勾子
  compiler.applyPlugins("after-plugins", compiler);

  // ....
  function itemToPlugin(item, name) {
    if (Array.isArray(item)) {
      // 多入口 ...
      return null
    }
    // 单入口
    return new SingleEntryPlugin(options.context, item, name)
  }

  // 处理入口
  if (typeof options.entry == "string" || Array.isArray(options.entry)) {
    compiler.apply(itemToPlugin(options.entry, "main"));
  } else if (typeof options.entry == "object") {
    // 单入口
    Object.keys(options.entry).forEach(function (name) {
      compiler.apply(itemToPlugin(options.entry[name], name));
    });
  }

  // apply 是 Compiler 继承自 Tapable 的方法
  // 用于调用参数里对象的 apply 方法
  compiler.apply(
    // 以下 plugin 订阅 compilation 事件
    new LoaderPlugin(),
    // new CommonJsPlugin()
  )

  // ....
  compiler.applyPlugins("after-resolvers", compiler);
  return options;
}
