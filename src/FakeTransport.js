'use strict';

//dependencies
var _ = require('lodash');

/**
 * @description Fake Transport
 * @type {Object}
 */
module.exports = exports = function FakeTransport(options) {
    //this refer to the Transport instance context

    //clone options
    options = _.merge({}, options || {});
};