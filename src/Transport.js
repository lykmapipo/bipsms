'use strict';

//dependencies
var _ = require('lodash');
var request = require('request');
var async = require('async');


/**
 * @description infobip sms transport
 *              It uses infobip HTTP JSON API to send and receive sms.
 * @param {[type]} options [description]
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
        receivedLogUrl: '/sms/1/inbox/logs'
    };

    //merge provided options with the default options
    this.options = _.merge(this.options, options);

    //initialize transport
    this._initialize();

}


/**
 * @description initalize transport
 * @return {[type]} [description]
 */
Transport.prototype._initialize = function() {

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
 * @description build base64 encode string of username:password
 * @return {[type]}                [description]
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
 * @description send single contextual sms to single or to multiple destination
 * @param  {[type]}   sms  [description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
Transport.prototype.sendSingle = function(sms, done) {

    //TODO validate message
    //TODO normalize from sms to e164

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueSendRequest(token, next) {
                //prepare send single request details
                var sendSingleRequestDetails = {
                    method: 'POST',
                    url: this.baseUrl + this.sendSingleUrl,
                    json: sms,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                };

                //issue send single request
                request(sendSingleRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            //try to parse response data to valid JSON object
            data = this._parse(data);

            //if error backoff
            if (error) {
                done(error);
            }

            //if invalid credentials provided
            //TODO handle other server side errors
            else if (response.statusCode !== 200) {
                //process response data to error

                var requestError = data.requestError || {};
                var serviceException = requestError.serviceException || {};
                var errorName = serviceException.messageId || 'UNAUTHORIZED';
                var errorCode = response.statusCode || 401;
                var errorMessage = serviceException.text || 'Invalid credentials';

                var _error = new Error(errorMessage);
                _error.code = errorCode;
                _error.name = errorName;

                done(_error);
            }

            //everything is okey return data as sms sent report
            else {
                done(null, data);
            }
        }.bind(this));
};


/**
 * @description send sms(s) to single or multiple destination
 * @param  {[type]}   sms  [description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
Transport.prototype.sendMulti = function(sms, done) {
    //TODO validate message
    //TODO normalize from sms to e164

    async.waterfall(
        [

            function buildAthorizationToken(next) {
                this.getAuthorizationToken(next);
            }.bind(this),

            function issueSendRequest(token, next) {
                //prepare send multi request details
                var sendMultiRequestDetails = {
                    method: 'POST',
                    url: this.baseUrl + this.sendMultiUrl,
                    json: sms,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                };

                //issue send single request
                request(sendMultiRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            //try to parse response data to valid JSON object
            data = this._parse(data);

            //if error backoff
            if (error) {
                done(error);
            }

            //if invalid credentials provided
            //TODO handle other server side errors
            else if (response.statusCode !== 200) {
                //process response data to error

                var requestError = data.requestError || {};
                var serviceException = requestError.serviceException || {};
                var errorName = serviceException.messageId || 'UNAUTHORIZED';
                var errorCode = response.statusCode || 401;
                var errorMessage = serviceException.text || 'Invalid credentials';

                var _error = new Error(errorMessage);
                _error.code = errorCode;
                _error.name = errorName;

                done(_error);
            }

            //everything is okey return data as sms sent report
            else {
                done(null, data);
            }
        }.bind(this));
};



/**
 * @description obtain delivery report of sent sms(s)
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
Transport.prototype.getDeliveryReport = function(options, done) {
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
                var deliveryReportRequestDetails = {
                    method: 'GET',
                    qs: options,
                    url: this.baseUrl + this.deliveryReportUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                };

                //issue delivery report request
                request(deliveryReportRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            //try to parse response data to valid JSON object
            data = this._parse(data);

            //if error backoff
            if (error) {
                done(error);
            }

            //if invalid credentials provided
            //TODO handle other server side errors
            else if (response.statusCode !== 200) {
                //process response data to error
                var requestError = data.requestError || {};
                var serviceException = requestError.serviceException || {};
                var errorName = serviceException.messageId || 'UNAUTHORIZED';
                var errorCode = response.statusCode || 401;
                var errorMessage = serviceException.text || 'Invalid credentials';

                var _error = new Error(errorMessage);
                _error.code = errorCode;
                _error.name = errorName;

                done(_error);
            }

            //everything is okey return data as delivery report
            else {
                done(null, data);
            }
        }.bind(this));
};



/**
 * @description  obtain sms send history
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
Transport.prototype.getLogs = function(options, done) {
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
                var logsRequestDetails = {
                    method: 'GET',
                    qs: options,
                    url: this.baseUrl + this.logsUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                };

                //issue logs history request
                request(logsRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            //try to parse response data to valid JSON object
            data = this._parse(data);

            //if error backoff
            if (error) {
                done(error);
            }

            //if invalid credentials provided
            //TODO handle other server side errors
            else if (response.statusCode !== 200) {
                //process response data to error
                var requestError = data.requestError || {};
                var serviceException = requestError.serviceException || {};
                var errorName = serviceException.messageId || 'UNAUTHORIZED';
                var errorCode = response.statusCode || 401;
                var errorMessage = serviceException.text || 'Invalid credentials';

                var _error = new Error(errorMessage);
                _error.code = errorCode;
                _error.name = errorName;

                done(_error);
            }

            //everything is okey return data as logs 
            else {
                done(null, data);
            }
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
                var balanceRequestDetails = {
                    method: 'GET',
                    url: this.baseUrl + this.balanceUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                };

                //issue balance request
                request(balanceRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            //try to parse response data to valid JSON object
            data = this._parse(data);

            //if error backoff
            if (error) {
                done(error);
            }

            //if invalid credentials provided
            //TODO handle other server side errors
            else if (response.statusCode !== 200) {
                //process response data to error
                var requestError = data.requestError || {};
                var serviceException = requestError.serviceException || {};
                var errorName = serviceException.messageId || 'UNAUTHORIZED';
                var errorCode = response.statusCode || 401;
                var errorMessage = serviceException.text || 'Invalid credentials';

                var _error = new Error(errorMessage);
                _error.code = errorCode;
                _error.name = errorName;

                done(_error);
            }

            //everything is okey return data as balance
            else {
                done(null, data);
            }
        }.bind(this));
};



/**
 * @description obtain received sms(s) from account inbox
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
Transport.prototype.getReceived = function(options, done) {
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
                var receivedSMSRequestDetails = {
                    method: 'GET',
                    qs: options,
                    url: this.baseUrl + this.receivedUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                };

                //issue received sms(s) request
                request(receivedSMSRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            //try to parse response data to valid JSON object
            data = this._parse(data);

            //if error backoff
            if (error) {
                done(error);
            }

            //if invalid credentials provided
            //TODO handle other server side errors
            else if (response.statusCode !== 200) {
                //process response data to error
                var requestError = data.requestError || {};
                var serviceException = requestError.serviceException || {};
                var errorName = serviceException.messageId || 'UNAUTHORIZED';
                var errorCode = response.statusCode || 401;
                var errorMessage = serviceException.text || 'Invalid credentials';

                var _error = new Error(errorMessage);
                _error.code = errorCode;
                _error.name = errorName;

                done(_error);
            }

            //everything is okey return data as received sms
            else {
                done(null, data);
            }
        }.bind(this));
};


/**
 * @description obtain received sms(s) log from account inbox
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
Transport.prototype.getReceivedLogs = function(options, done) {
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
                var receivedSMSLogRequestDetails = {
                    method: 'GET',
                    qs: options,
                    url: this.baseUrl + this.receivedLogUrl,
                    headers: {
                        Accept: 'application/json',
                        Authorization: token
                    }
                };

                //issue received sms(s) request
                request(receivedSMSLogRequestDetails, next);

            }.bind(this)
        ],
        function finalize(error, response, data) {
            //try to parse response data to valid JSON object
            data = this._parse(data);

            //if error backoff
            if (error) {
                done(error);
            }

            //if invalid credentials provided
            //TODO handle other server side errors
            else if (response.statusCode !== 200) {
                //process response data to error
                var requestError = data.requestError || {};
                var serviceException = requestError.serviceException || {};
                var errorName = serviceException.messageId || 'UNAUTHORIZED';
                var errorCode = response.statusCode || 401;
                var errorMessage = serviceException.text || 'Invalid credentials';

                var _error = new Error(errorMessage);
                _error.code = errorCode;
                _error.name = errorName;

                done(_error);
            }

            //everything is okey return data as received sms(s) log
            else {
                done(null, data);
            }
        }.bind(this));
};

//export transport
module.exports = exports = Transport;