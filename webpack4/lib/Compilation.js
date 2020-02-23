var Tapable = require("tapable");
var ArrayMap = require("./ArrayMap");
var Module = require("./Module");
const Chunk = require("./Chunk");
const Semaphore = require("./util/Semaphore");


/**
 *  为每个 chunk 分配 hash
 */
Compilation.prototype.createHash = function createHash() {
  // 模拟 hash
  this.hash = Date.now()
}

/**
 *  渲染，将结果保存在 compilation.assets
 */
class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.hooks = {
      /** @type {SyncHook<Module>} */
      buildModule: new SyncHook(["module"]),
    };
    this.compiler = compiler;
    this.mainTemplate = compiler.mainTemplate;
    this.chunkTemplate = compiler.chunkTemplate;
    // .....
    this.moduleTemplate = compiler.moduleTemplate;
    this.resolvers = compiler.resolvers;
    this.inputFileSystem = compiler.inputFileSystem;
    // .....
    var options = this.options = compiler.options;
    this.outputOptions = options && options.output;

    this.semaphore = new Semaphore(options.parallelism || 100);

    this.entries = [];
    // 所有 module build 完成后将入口 module 放到 preparedChunks
    this.preparedChunks = [];
    // .....
    this.chunks = [];
    // 以 name 为 key
    this.namedChunks = {};
    this.modules = [];
    // 以 request 为 key
    this._modules = {};
    // id 增加器
    this.nextFreeModuleId = 1;
    this.nextFreeChunkId = 0;
    // ....
    this.assets = {};
    // ...
    this.dependencyFactories = new ArrayMap();
    // compilation.dependencyTemplates.set(CommonJsRequireDependency, new CommonJsRequireDependency.Template()); .....
    this.dependencyTemplates = new ArrayMap();
  }

  /**
   *
   * @param {string} context context string path
   * @param {Dependency} dependency dependency used to create Module chain
   * @param {OnModuleCallback} onModule function invoked on modules creation
   * @param {ModuleChainCallback} callback callback for when module chain is complete
   * @returns {void} will throw if dependency instance is not a valid Dependency
   */
  _addModuleChain(context, dependency, onModule, callback) {
    // ...
    const Dep = /** @type {DepConstructor} */ (dependency.constructor);
    const moduleFactory = this.dependencyFactories.get(Dep);

    this.semaphore.acquire(() => {
      moduleFactory.create(
        {
          contextInfo: {
            issuer: "",
            compiler: this.compiler.name
          },
          context: context,
          dependencies: [dependency]
        },
        (err, module) => {
          // ...
          const addModuleResult = this.addModule(module);
          module = addModuleResult.module;

          onModule(module);

          dependency.module = module;

          const afterBuild = () => {
            if (addModuleResult.dependencies) {
              this.processModuleDependencies(module, err => {
                if (err) return callback(err);
                callback(null, module);
              });
            } else {
              return callback(null, module);
            }
          };


          if (addModuleResult.build) {
            this.buildModule(module, false, null, null, err => {
              this.semaphore.release();
              afterBuild();
            });
          } else {
            this.semaphore.release();
            this.waitForBuildingFinished(module, afterBuild);
          }
        }
      );
    });
  }

  /**
   *
   * @param {string} context context path for entry
   * @param {Dependency} entry entry dependency being created
   * @param {string} name name of entry
   * @param {ModuleCallback} callback callback function
   * @returns {void} returns
   */
  addEntry(context, entry, name, callback) {
    this.hooks.addEntry.call(entry, name);
    // ....
    this._addModuleChain(
      context,
      entry,
      module => {
        this.entries.push(module);
      },
      (err, module) => {
        // todo
      }
    );
  }

  createChunkAssets() {
    var outputOptions = this.outputOptions;
    var filename = outputOptions.filename || "bundle.js";
    var chunkFilename = outputOptions.chunkFilename || "[id]." + filename.replace(Template.REGEXP_NAME, "");
    // ...

    for (var i = 0; i < this.modules.length; i++) {
      var module = this.modules[i];
      if (module.assets) {
        // 渲染图片一类的资源，将 module.assets 拷贝到 compilation.assets
        Object.keys(module.assets).forEach(function (name) {
          var file = name.replace(Template.REGEXP_HASH, this.hash);
          this.assets[file] = module.assets[name];
          this.applyPlugins("module-asset", module, file);
        }, this);
      }
    }

    // ...
    for (var i = 0; i < this.chunks.length; i++) {
      var chunk = this.chunks[i];
      chunk.files = [];
      var source;
      var file;
      // 一般情况下 filenameTemplate 为 'bundle.js'
      var filenameTemplate = chunk.filenameTemplate ? chunk.filenameTemplate :
        chunk.initial ? filename :
          chunkFilename;

      try {
        if (chunk.entry) {// 渲染入口 chunk，比如 runtime chunk
          // ....
          // *** 重点
          // source 是一个 ConcatSource 实例
          // this.mainTemplate - JsonMainTemplate, JsonTemplatePlugin 注册
          // this.moduleTemplate - FunctionModuleTemplate
          source = this.mainTemplate.render(this.hash, chunk, this.moduleTemplate, this.dependencyTemplates);
          // ...
        } else {// 渲染非入口 chunk
          // ...
          // this.chunkTemplate - JsonChunkTemplate, JsonTemplatePlugin 注册
          source = this.chunkTemplate.render(chunk, this.moduleTemplate, this.dependencyTemplates);
          // ...
        }
        // ...
      } catch (e) {
        console.error(e)
      }

      this.assets[file = filenameTemplate] = source;
      chunk.files.push(file);
      this.applyPlugins("chunk-asset", chunk, file);
      // ...
    }
  }
}
