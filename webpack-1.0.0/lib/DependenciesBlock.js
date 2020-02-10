// var DependenciesBlockVariable = require("./DependenciesBlockVariable");

function DependenciesBlock() {
  this.dependencies = [];
}
module.exports = DependenciesBlock;

DependenciesBlock.prototype.addDependency = function(dependency) {
  this.dependencies.push(dependency);
}
