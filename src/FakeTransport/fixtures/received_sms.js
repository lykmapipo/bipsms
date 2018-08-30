'use strict';

//dependencies
var _ = require('lodash');
var uuid = require('uuid');
var moment = require('moment');
var randomNumber = require('random-number');
var receivedDays = randomNumber({
  min: -30,
  max: -1
});


module.exports = exports = function (options, done) {
  //received sms template
  var template = {
    messageId: uuid.v4(),
    from: String(randomNumber({
      min: 11111111111,
      max: 99999999999,
      integer: true
    })),
    to: String(randomNumber({
      min: 11111111111,
      max: 99999999999,
      integer: true
    })),
    text: 'KEYWORD Test message',
    cleanText: 'Test message',
    keyword: 'KEYWORD',
    receivedAt: moment(new Date()).add(receivedDays, 'days'),
    smsCount: 1
  };

  //prepare multi message delivery report
  var limit = options.limit || 50;

  var receivedSMS = _.range(0, limit).map(function () {
    return _.merge({}, template, _.omit(options, 'limit'));
  });

  var response = {
    results: receivedSMS
  };

  done(null, response);
};