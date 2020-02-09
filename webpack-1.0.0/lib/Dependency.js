/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
function Dependency() {
	this.module = null;
	this.Class = Dependency;
}
module.exports = Dependency;

Dependency.prototype.isEqualResource = function(other) {
	return false;
};
