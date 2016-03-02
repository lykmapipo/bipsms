'use strict';

//dependencies
var path = require('path');
var _ = require('lodash');
var request = require('request');
var async = require('async');
var FakeTransport = require(path.join(__dirname, 'FakeTransport'));

/**
 * @constructor
 * @description infobip sms transport
 *              It uses infobip HTTP JSON API to send and receive sms.
 * @param {Object} options options to configure the transport instance
 * @public
 */
function Transport(options) {
    //prepare extended options
    options = options || {};

    //default options
    this.options = {
        baseUrl: 'https://api.infobip.com',
        username: undefined,
        password: undefined,
        balanceUrl: '/account/1/balance',
        logsUrl: '/sms/1/logs',
        deliveryReportUrl: '/sms/1/reports',
        sendSingleUrl: '/sms/1/text/single',
        sendMultiUrl: '/sms/1/text/multi',
        receivedUrl: '/sms/1/inbox/reports',
        receivedLogUrl: '/sms/1/inbox/logs',
        request: {} //request options
    };

    //merge provided options with the default options
    this.options = _.merge({}, this.options, options);

    //initialize transport
    this._initialize();

    //setup as fake transport if so
    if (this.options.fake) {
        FakeTransport.call(this);
    }
}


/**
 * @function
 * @description initalize transport and add options magic getter and setter
 * @private
 */
Transport.prototype._initialize = function() {
    //its not fake
    this.isFake = false;

    //extend transport with magic setter and getter for options
    _.forEach(_.keys(this.options), function(option) {
        Object.defineProperty(this, option, {
            get: function() {
                return this.options[option];
            }.bind(this),
            set: function(value) {
                this.options[option] = value;
            }.bind(this)
        });
    }.bind(this));

};



/**
 * @function
 * @description prepare base64 encode string of username:password as authentication
 *              token
 * @param {Function} done a callback to invoke on success or failure
 * @return {String}                base64 encoded authentication token
 * @public
 */
Transport.prototype.getAuthorizationToken = function(done) {
    //if there is username and password
    //build authorization token
    if (this.username && this.password) {
        //concatenate username and password as per 
        //infobip API requirements
        var usernameAndPassword = this.username + ':' + this.password;
        var buffer = new Buffer(usernameAndPassword);

        //base64 encode username and password
        var authorizationToken = 'Basic ' + buffer.toString('base64');

        done(null, authorizationToken);
    }
    //back-off
    //no username and password provided
    else {
        done(new Error('No username or password provided'));
    }

};


/**
 * @function
 * @description parsing given data to json object
 * @param  {String|Object} data data to be parsed to JSON
 * @return {Object}      JSON format of the data
 * @private
 */
Transport.prototype._parse = function(data) {
    data = data || {};
    //try to parse data as a JSON
    try {
        data = JSON.parse(data);
    }
    //catch all errors and return a previous data
    catch (error) {
        data = data;
    }

    return data;
};


/**
 * @function
 * @description internal utility to process response results
 * @param  {Error}   error    any request error
 * @param  {Object}   response request response
 * @param  {Object}   data     response data from the api call
 * @param  {Function} done     a callback to invoke on success or error response
 * @return {Object}            valid response data based on the api calls
 * @private
 */
Transport.prototype._respond = function(error, response, data, done) {
    //try to parse response data to valid JSON object
    data = this._parse(data);

    //if error backoff
    if (error) {
        done(error);
    }

    //process response error
    else if (response.statusCode !== 200) {

        //process response data to error
        var serviceException = _.get(data, 'requestError.serviceException', {});
        var errorName = serviceException.messageId || 'UNAUTHORIZED';
        var errorCode = response.statusCode || 401;
        var errorMessage = serviceException.text || 'Invalid credentials';

        error = new Error(errorMessage);
        error.code = errorCode;
        error.name = errorName;

        done(error);
    }

    //everything is okey return data as a reponse
    else {
        done(null, data);
    }
};



/**
 * @function
 * @description send single contextual sms to single or to multiple destination
 * @param  {Object}   sms  valid sms object
 * @param  {Function} done a callback to invoke on send success or failure
 * @public
 */
Transport.prototype.sendSingleSMS = function(sms, done) {

    //TODO validate message
    //TODO normalize numbers to e164 format

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueSendRequest(token, next) {
                //prepare send single request details
                var sendSingleRequestDetails = _.merge({
                    method: 'POST',
                    url: this.baseUrl + this.sendSingleUrl,
                    json: sms,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                }, this.request);

                //issue send single request
                request(sendSingleRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            this._respond(error, response, data, done);
        }.bind(this));
};


/**
 * @function
 * @description send sms(s) to single or multiple destination
 * @param  {Object}   sms  valid multiple SMS object to send
 * @param  {Function} done a callback to invoke on success or error
 * @return {Object}        sent multiple SMS response
 * @public
 */
Transport.prototype.sendMultiSMS = function(sms, done) {
    //TODO validate message
    //TODO normalize from sms to e164

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueSendRequest(token, next) {
                //prepare send multi request details
                var sendMultiRequestDetails = _.merge({
                    method: 'POST',
                    url: this.baseUrl + this.sendMultiUrl,
                    json: sms,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                }, this.request);

                //issue send single request
                request(sendMultiRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            this._respond(error, response, data, done);
        }.bind(this));
};



/**
 * @function
 * @description obtain delivery report of sent sms(s)
 * @param  {Object}   options filters to apply on delivery reports
 * @param  {Function} done    a callback to invoke on success or failure
 * @return {Object}           SMS sent delivery reports
 * @public
 */
Transport.prototype.getDeliveryReports = function(options, done) {
    //if no options provided
    if (_.size(arguments) === 1) {
        done = options;
        options = {};
    }

    //prepare delivery report request params
    options = options || {};

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueDeliveryRequest(token, next) {
                //prepare delivery report request details
                var deliveryReportRequestDetails = _.merge({
                    method: 'GET',
                    qs: options,
                    url: this.baseUrl + this.deliveryReportUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                }, this.request);

                //issue delivery report request
                request(deliveryReportRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            this._respond(error, response, data, done);
        }.bind(this));
};



/**
 * @function
 * @description  obtain sms send history/logs
 * @param  {Object}   options filters to apply on sent sms logs
 * @param  {Function} done    a callback to  invoke on success or error
 * @return {Object}           sent SMS logs response
 * @public
 */
Transport.prototype.getSentSMSLogs = function(options, done) {
    //if no options provided
    if (_.size(arguments) === 1) {
        done = options;
        options = {};
    }

    //prepare logs request params
    options = options || {};

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueLogsRequest(token, next) {
                //prepare logs history request details
                var logsRequestDetails = _.merge({
                    method: 'GET',
                    qs: options,
                    url: this.baseUrl + this.logsUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                }, this.request);

                //issue logs history request
                request(logsRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            this._respond(error, response, data, done);
        }.bind(this));
};



/**
 * @description obtain current balance of the transaport account
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
Transport.prototype.getBalance = function(done) {

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueBalanceRequest(token, next) {
                //prepare request details
                var balanceRequestDetails = _.merge({
                    method: 'GET',
                    url: this.baseUrl + this.balanceUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                }, this.request);

                //issue balance request
                request(balanceRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            this._respond(error, response, data, done);
        }.bind(this));
};



/**
 * @function
 * @description obtain received sms(s) from account inbox
 * @param  {[type]}   options filters to apply on received SMS
 * @param  {Function} done    a callback to invoke on success or failure
 * @return {Object}           received message response
 * @public
 */
Transport.prototype.getReceivedSMS = function(options, done) {
    //if no options provided
    if (_.size(arguments) === 1) {
        done = options;
        options = {};
    }

    //prepare received sms(s) request params
    options = options || {};

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueReceivedSMSRequest(token, next) {
                //prepare received sms(s) request details
                var receivedSMSRequestDetails = _.merge({
                    method: 'GET',
                    qs: options,
                    url: this.baseUrl + this.receivedUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                }, this.request);

                //issue received sms(s) request
                request(receivedSMSRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            this._respond(error, response, data, done);
        }.bind(this));
};


/**
 * @function
 * @description obtain received sms(s) log from account inbox
 * @param  {Object}   options filters to apply on received SMS logs
 * @param  {Function} done    a callback to invoke on success or failure
 * @return {Object}           received SMS log response
 * @public
 */
Transport.prototype.getReceivedSMSLogs = function(options, done) {
    //if no options provided
    if (_.size(arguments) === 1) {
        done = options;
        options = {};
    }

    //prepare received log sms(s) request params
    options = options || {};

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueReceivedSMSLogRequest(token, next) {
                //prepare received sms(s) log request details
                var receivedSMSLogRequestDetails = _.merge({
                    method: 'GET',
                    qs: options,
                    url: this.baseUrl + this.receivedLogUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                }, this.request);

                //issue received sms(s) request
                request(receivedSMSLogRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            this._respond(error, response, data, done);
        }.bind(this));
};

//export transport constructor
module.exports = exports = Transport;