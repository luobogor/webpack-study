var Tapable = require("tapable");

function Parser(options) {
  Tapable.call(this);
  this.options = options;
  // this.initializeEvaluating();
}
module.exports = Parser;
Parser.prototype = Object.create(Tapable.prototype);
