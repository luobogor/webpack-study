// var DependenciesBlockVariable = require("./DependenciesBlockVariable");

function DependenciesBlock() {
  this.dependencies = [];
  // 暂时不清楚以下这个变量有什么用
  this.blocks = [];
  this.variables = [];
}
module.exports = DependenciesBlock;

DependenciesBlock.prototype.addDependency = function(dependency) {
  this.dependencies.push(dependency);
}
