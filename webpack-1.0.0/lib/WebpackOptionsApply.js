var SingleEntryPlugin = require("./SingleEntryPlugin");
var FunctionModulePlugin = require("webpack/lib/FunctionModulePlugin");
var CommonJsPlugin = require("webpack/lib/dependencies/CommonJsPlugin");
// resolver 相关 plugin
var UnsafeCachePlugin = require("enhanced-resolve/lib/UnsafeCachePlugin");
var ModulesInDirectoriesPlugin = require("enhanced-resolve/lib/ModulesInDirectoriesPlugin");
var ModulesInRootPlugin = require("enhanced-resolve/lib/ModulesInRootPlugin");
var ModuleTemplatesPlugin = require("enhanced-resolve/lib/ModuleTemplatesPlugin");
var ModuleAsFilePlugin = require("enhanced-resolve/lib/ModuleAsFilePlugin");
var ModuleAsDirectoryPlugin = require("enhanced-resolve/lib/ModuleAsDirectoryPlugin");
var ModuleAliasPlugin = require("enhanced-resolve/lib/ModuleAliasPlugin");
var DirectoryDefaultFilePlugin = require("enhanced-resolve/lib/DirectoryDefaultFilePlugin");
var DirectoryDescriptionFilePlugin = require("enhanced-resolve/lib/DirectoryDescriptionFilePlugin");
var DirectoryDescriptionFileFieldAliasPlugin = require("enhanced-resolve/lib/DirectoryDescriptionFileFieldAliasPlugin");
var FileAppendPlugin = require("enhanced-resolve/lib/FileAppendPlugin");
// 渲染相关插件
var APIPlugin = require("webpack/lib/APIPlugin");
var ConstPlugin = require("webpack/lib/ConstPlugin");
var RequireJsStuffPlugin = require("webpack/lib/RequireJsStuffPlugin");
var NodeStuffPlugin = require("webpack/lib/NodeStuffPlugin");
var CompatibilityPlugin = require("webpack/lib/CompatibilityPlugin");
var RequireContextPlugin = require("webpack/lib/dependencies/RequireContextPlugin");
var RequireEnsurePlugin = require("webpack/lib/dependencies/RequireEnsurePlugin");
var RequireIncludePlugin = require("webpack/lib/dependencies/RequireIncludePlugin");

function WebpackOptionsApply() {}

module.exports = WebpackOptionsApply;

WebpackOptionsApply.prototype.process = function (options, compiler) {
  // 执行用户自定义的 plugins
  compiler.context = options.context;
  if (options.plugins && Array.isArray(options.plugins)) {
    compiler.apply.apply(compiler, options.plugins);
  }
  compiler.outputPath = options.output.path;

  switch (options.target) {
    case 'web':
      var JsonpTemplatePlugin = require("webpack/lib/JsonpTemplatePlugin");
      compiler.apply(
        new JsonpTemplatePlugin(options.output),
        new FunctionModulePlugin(options.output),
        // ...
      );
      break;
    // case ....
  }

  // *** 执行内置 plugins ***
  // ....
  function itemToPlugin(item, name) {
    // 处理多入口，多个入口一个 chunk
    // {
    //   entry: ['entry1Path','entry2Path',...]
    // }
    if (Array.isArray(item)) {
      return null
    }
    // 单入口
    // {
    //   entry: 'entryPath'
    // }
    // 多个单入口，也就是一个入口一个chunk
    // {
    //   entry: {
    //     'entry1Name': 'entry1Path',
    //     'entry2Name': 'entry2Path',
    //   }
    // }
    return new SingleEntryPlugin(options.context, item, name)
  }

  if (typeof options.entry == "string" || Array.isArray(options.entry)) {
    compiler.apply(itemToPlugin(options.entry, "main"));// 使用'main'作为默认入口名称
  } else if (typeof options.entry == "object") {
    Object.keys(options.entry).forEach(function (name) {
      compiler.apply(itemToPlugin(options.entry[name], name));
    });
  }

  // apply 是 Compiler 继承自 Tapable 的方法
  // 用于调用参数里对象的 apply 方法
  compiler.apply(
    // 以下插件在渲染过程中使用，不用细看
    new CompatibilityPlugin(),
    new NodeStuffPlugin(options.node),
    new RequireJsStuffPlugin(),
    new APIPlugin(),
    new ConstPlugin(),
    new RequireIncludePlugin(),
    new RequireEnsurePlugin(),
    new RequireContextPlugin(options.resolve.modulesDirectories, options.resolve.extensions),
    // 订阅 compilation 事件
    new CommonJsPlugin(),
    // ....
  )
  // ....
  // *** 执行内置 plugins 结束 ***
  compiler.applyPlugins("after-plugins", compiler);
  // ....
  // 使用以下插件用于解析 normalModule 文件路径
  compiler.resolvers.normal.apply(
    // 增加 compiler.resolvers.normal.resolve 方法
    new UnsafeCachePlugin(options.resolve.unsafeCache),
    options.resolve.packageAlias ? new DirectoryDescriptionFileFieldAliasPlugin("package.json", options.resolve.packageAlias) : function () {},
    new ModuleAliasPlugin(options.resolve.alias),
    makeRootPlugin("module", options.resolve.root),
    new ModulesInDirectoriesPlugin("module", options.resolve.modulesDirectories),
    makeRootPlugin("module", options.resolve.fallback),
    new ModuleAsFilePlugin("module"),
    new ModuleAsDirectoryPlugin("module"),
    new DirectoryDescriptionFilePlugin("package.json", options.resolve.packageMains),
    new DirectoryDefaultFilePlugin(["index"]),
    new FileAppendPlugin(options.resolve.extensions)
    // ...
  );
  // 使用以下插件用于解析 loader 文件路径
  compiler.resolvers.loader.apply(
    new UnsafeCachePlugin(options.resolve.unsafeCache),
    new ModuleAliasPlugin(options.resolveLoader.alias),
    makeRootPlugin("loader-module", options.resolveLoader.root),
    new ModulesInDirectoriesPlugin("loader-module", options.resolveLoader.modulesDirectories),
    makeRootPlugin("loader-module", options.resolveLoader.fallback),
    new ModuleTemplatesPlugin("loader-module", options.resolveLoader.moduleTemplates, "module"),
    new ModuleAsFilePlugin("module"),
    new ModuleAsDirectoryPlugin("module"),
    new DirectoryDescriptionFilePlugin("package.json", options.resolveLoader.packageMains),
    new DirectoryDefaultFilePlugin(["index"]),
    new FileAppendPlugin(options.resolveLoader.extensions)
  );
  // ...
  compiler.applyPlugins("after-resolvers", compiler);
  return options;
}

function makeRootPlugin(name, root) {
  if (typeof root === "string")
    return new ModulesInRootPlugin(name, root);
  else if (Array.isArray(root)) {
    return function () {
      root.forEach(function (root) {
        this.apply(new ModulesInRootPlugin(name, root));
      }, this);
    }
  }
  return function () {};
}
