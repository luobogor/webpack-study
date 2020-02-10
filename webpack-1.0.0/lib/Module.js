var DependenciesBlock = require("./DependenciesBlock");

function Module() {
  DependenciesBlock.call(this);
  this.context = null;
  this.id = null;
  this.chunks = [];
}

module.exports = Module;

Module.prototype = Object.create(DependenciesBlock.prototype);
Module.prototype.identifier = null;

Module.prototype.addChunk = function (chunk) {
  var idx = this.chunks.indexOf(chunk);
  if (idx < 0) {
    this.chunks.push(chunk);
  }
};
