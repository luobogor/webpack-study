function Chunk(name, module, loc) {
  this.id = null;
  this.ids = null;
  this.name = name;
  this.modules = [];
  this.chunks = [];
  // ...
  this.origins = [];
  this.rendered = false;
  this.entry = false;
  this.initial = false;
  if (module) {
    this.origins.push({
      module: module,
      loc: loc,
      name: name
    });
  }
}

module.exports = Chunk;

Chunk.prototype.addModule = function (module) {
  if (this.modules.indexOf(module) >= 0) {
    return false;
  }
  this.modules.push(module);
  return true;
};

Chunk.prototype.addOrigin = function (module, loc) {
  this.origins.push({
    module: module,
    loc: loc,
    name: this.name
  });
};
