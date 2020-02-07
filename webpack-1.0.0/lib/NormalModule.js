var Module = require("./Module");
var NormalModuleMixin = require("./NormalModuleMixin");

function NormalModule(request, userRequest, rawRequest, loaders, resource, parser) {
  Module.call(this);
  this.request = request;
  this.userRequest = userRequest;
  this.rawRequest = rawRequest;
  this.parser = parser;
  NormalModuleMixin.call(this, loaders, resource);
  this.meta = {};
  this.assets = {};
  this.built = false;
}

module.exports = NormalModule;

NormalModule.prototype = Object.create(Module.prototype);
NormalModuleMixin.mixin(NormalModule.prototype);

NormalModule.prototype.identifier = function () {
  return this.request;
};

NormalModule.prototype.build = function build(options, compilation, resolver, fs, callback) {
  this.built = true;
  return this.doBuild(
    options,
    compilation,
    resolver,
    fs,
    function (err) {

    }.bind(this))
}
