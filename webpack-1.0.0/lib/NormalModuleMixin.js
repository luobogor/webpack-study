var path = require("path"); // TODO refactor

function NormalModuleMixin(loaders, resource) {
  this.resource = resource;
  this.loaders = loaders;
  var resourcePath = this.splitQuery(this.resource)[0];
  this.context = resourcePath ? path.dirname(resourcePath) : null;
  this.fileDependencies = [];
  this.contextDependencies = [];
  this._source = null;
}
module.exports = NormalModuleMixin;

NormalModuleMixin.mixin = function(pt) {
  for(var name in NormalModuleMixin.prototype)
    pt[name] = NormalModuleMixin.prototype[name];
};

NormalModuleMixin.prototype.doBuild = function doBuild(options, moduleContext, resolver, fs, callback) {

}
