function DependenciesBlockVariable(name, expression, dependencies) {
  this.name = name;
  this.expression = expression;
  this.dependencies = dependencies || [];
}
module.exports = DependenciesBlockVariable;
