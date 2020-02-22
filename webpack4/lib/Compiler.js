const {
  Tapable,
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook
} = require("tapable");


class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {}
  }

  run() {

  }
}

module.exports = Compiler;

