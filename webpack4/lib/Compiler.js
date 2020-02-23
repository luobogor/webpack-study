const {
  Tapable,
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook
} = require("tapable");

const Compilation = require("./Compilation");
const NormalModuleFactory = require("./NormalModuleFactory");

class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      /** @type {SyncBailHook<Compilation>} */
      shouldEmit: new SyncBailHook(["compilation"]),
      /** @type {AsyncSeriesHook<Stats>} */
      done: new AsyncSeriesHook(["stats"]),
      /** @type {AsyncSeriesHook<>} */
      additionalPass: new AsyncSeriesHook([]),
      /** @type {AsyncSeriesHook<Compiler>} */
      beforeRun: new AsyncSeriesHook(["compiler"]),
      /** @type {AsyncSeriesHook<Compiler>} */
      run: new AsyncSeriesHook(["compiler"]),
      /** @type {AsyncSeriesHook<Compilation>} */
      emit: new AsyncSeriesHook(["compilation"]),
      /** @type {AsyncSeriesHook<string, Buffer>} */
      assetEmitted: new AsyncSeriesHook(["file", "content"]),
      /** @type {AsyncSeriesHook<Compilation>} */
      afterEmit: new AsyncSeriesHook(["compilation"]),

      /** @type {SyncHook<Compilation, CompilationParams>} */
      thisCompilation: new SyncHook(["compilation", "params"]),
      /** @type {SyncHook<Compilation, CompilationParams>} */
      compilation: new SyncHook(["compilation", "params"]),
      /** @type {SyncHook<NormalModuleFactory>} */
      normalModuleFactory: new SyncHook(["normalModuleFactory"]),

      /** @type {AsyncSeriesHook<CompilationParams>} */
      beforeCompile: new AsyncSeriesHook(["params"]),
      /** @type {SyncHook<CompilationParams>} */
      compile: new SyncHook(["params"]),
      /** @type {AsyncParallelHook<Compilation>} */
      make: new AsyncParallelHook(["compilation"]),
      /** @type {AsyncSeriesHook<Compilation>} */
      afterCompile: new AsyncSeriesHook(["compilation"]),

      /** @type {SyncHook<Error>} */
      failed: new SyncHook(["error"]),
      /** @type {SyncHook<string, string>} */
      invalid: new SyncHook(["filename", "changeTime"]),
      /** @type {SyncHook} */
      watchClose: new SyncHook([]),

      /** @type {SyncBailHook<string, string, any[]>} */
      infrastructureLog: new SyncBailHook(["origin", "type", "args"]),

      // TODO the following hooks are weirdly located here
      // TODO move them for webpack 5
      /** @type {SyncHook} */
      environment: new SyncHook([]),
      /** @type {SyncHook} */
      afterEnvironment: new SyncHook([]),
      /** @type {SyncHook<Compiler>} */
      afterPlugins: new SyncHook(["compiler"]),
      /** @type {SyncHook<Compiler>} */
      afterResolvers: new SyncHook(["compiler"]),
      /** @type {SyncBailHook<string, Entry>} */
      entryOption: new SyncBailHook(["context", "entry"])
    };

    this.outputFileSystem = null;
    this.inputFileSystem = null;

    /** @type {WebpackOptions} */
    this.options = /** @type {WebpackOptions} */ ({});

    this.resolvers = {
      normal: {},
      loader: {},
    };
  }

  run(callback) {
    const startTime = new Date().getTime();

    const onCompiled = (err, compilation) => {

    }

    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        // ...
        this.compile(onCompiled);
      });
    })
  }

  newCompilationParams() {
    const params = {
      normalModuleFactory: this.createNormalModuleFactory(),
    };
    return params;
  }

  createCompilation() {
    return new Compilation(this);
  }

  newCompilation(params) {
    const compilation = this.createCompilation();
    compilation.name = this.name;
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }

  compile() {
    const params = this.newCompilationParams();

    this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params);


      this.hooks.make.callAsync(compilation, err => {

      })
    })
  }
}

module.exports = Compiler;

