'use strict';

//dependencies

/**
 * @description Fake Transport
 * @type {Object}
 */
module.exports = exports = function FakeTransport() {
    //this refer to the Transport instance context

    //set isFake to true to signal fake transport
    this.isFake = true;
};