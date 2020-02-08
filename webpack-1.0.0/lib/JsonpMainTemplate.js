var MainTemplate = require("./MainTemplate");
var Template = require("./Template");

function JsonpMainTemplate(outputOptions) {
  MainTemplate.call(this, outputOptions);
}
module.exports = JsonpMainTemplate;

JsonpMainTemplate.prototype = Object.create(MainTemplate.prototype);
JsonpMainTemplate.prototype.constructor = JsonpMainTemplate;

