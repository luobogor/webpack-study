var ConcatSource = require("webpack-core/lib/ConcatSource");
var Template = require("./Template");

function MainTemplate(outputOptions) {
  Template.call(this, outputOptions);
}

module.exports = MainTemplate;

MainTemplate.prototype = Object.create(Template.prototype);
MainTemplate.prototype.requireFn = "require";
MainTemplate.prototype.render = function (hash, chunk, moduleTemplate, dependencyTemplates) {

}
