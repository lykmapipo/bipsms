'use strict';

//dependencies
var _ = require('lodash');
var randomNumber = require('random-number');


/**
 * @description Fake Transport
 * @type {Object}
 */
module.exports = exports = function FakeTransport() {
    //this refer to the Transport instance context

    if (_.isBoolean(this.options.fake)) {
        this.options.fake = {};
    }

    //prepare faker options
    var fakeOptions = _.merge({}, {
        currency: 'USD',
        balance: {
            min: 100,
            max: 2000
        }
    }, this.options.fake);

    //set isFake to true to signal fake transport
    this.isFake = true;

    //simulate getBalance
    this.getBalance = function(done) {
        //TODO simulate error

        var balance = {
            balance: randomNumber(fakeOptions.balance),
            currency: fakeOptions.currency
        };

        done(null, balance);
    };

};