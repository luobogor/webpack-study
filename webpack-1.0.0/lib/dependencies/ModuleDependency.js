var Dependency = require("../Dependency");

function ModuleDependency(request) {
  Dependency.call(this);
  this.request = request;
  this.userRequest = request;
  this.Class = ModuleDependency;
}

module.exports = ModuleDependency;

ModuleDependency.prototype = Object.create(Dependency.prototype);

ModuleDependency.prototype.isEqualResource = function isEqualResource(other) {
  if (!(other instanceof ModuleDependency)) {
    return false
  }

  return this.request == other.request;
}
