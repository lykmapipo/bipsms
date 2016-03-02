'use strict';

//dependencies
var path = require('path');
var _ = require('lodash');
var randomNumber = require('random-number');
var fetchLog = require(path.join(__dirname, 'fixtures', 'log'));
var fetchReceivedSMS = require(path.join(__dirname, 'fixtures', 'received_sms'));
var sendSMS = require(path.join(__dirname, 'fixtures', 'send_sms'));

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
        pricePerMessage: 0.01,
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

    //simulate fetch delivery reports
    this.getDeliveryReports = function(options, done) {

        //normalize arguments
        if (_.isFunction(options)) {
            done = options;
            options = {};
        }

        fetchLog(options, done);
    };

    //simulate fetch received SMS
    this.getReceivedSMS = function(options, done) {

        //normalize arguments
        if (_.isFunction(options)) {
            done = options;
            options = {};
        }

        fetchReceivedSMS(options, done);
    };

    //simulate fetch received SMS log
    this.getReceivedSMSLogs = this.getReceivedSMS;

    //simulate send multi SMS
    this.sendMultiSMS = function(sms, done) {
        sendSMS(sms.messages, done);
    };

    //simulate send single SMS
    this.sendSingleSMS = function(sms, done) {
        sendSMS(sms, done);
    };

    //simulate fetch sent logs
    this.getSentSMSLogs = function(options, done) {

        //normalize arguments
        if (_.isFunction(options)) {
            done = options;
            options = {};
        }

        fetchLog(options, done);
    };
};