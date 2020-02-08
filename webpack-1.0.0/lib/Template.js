var ConcatSource = require("webpack-core/lib/ConcatSource");

function Template(outputOptions) {
  this.outputOptions = outputOptions || {};
}
module.exports = Template;

Template.REGEXP_NAME = /\[name\]/gi;
