/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

class Semaphore {
  /**
   * Creates an instance of Semaphore.
   *
   * @param {number} available the amount available number of "tasks"
   * in the Semaphore
   */
  constructor(available) {
    this.available = available;
    /** @type {(function(): void)[]} */
    this.waiters = [];
    /** @private */
    this._continue = this._continue.bind(this);
  }
}

module.exports = Semaphore;
