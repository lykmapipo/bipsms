'use strict';

//dependencies
var _ = require('lodash');
var { v4: uuidv4 } = require('uuid');
var moment = require('moment');
var randomNumber = require('random-number');
var sentDays = randomNumber({
  min: -30,
  max: -15
});
var doneDays = randomNumber({
  min: -14,
  max: -1
});


module.exports = exports = function (options, done) {
  //sms delivery report template
  var template = {
    bulkId: uuidv4(),
    messageId: uuidv4(),
    to: String(randomNumber({
      min: 11111111111,
      max: 99999999999,
      integer: true
    })),
    from: String(randomNumber({
      min: 11111111111,
      max: 99999999999,
      integer: true
    })),
    sentAt: moment(new Date()).add(sentDays, 'days'),
    doneAt: moment(new Date()).add(doneDays, 'days'),
    smsCount: randomNumber({
      min: 0,
      max: 1
    }),
    mccMnc: 22801,
    price: {
      pricePerMessage: options.pricePerMessage,
      currency: options.currency
    },
    status: {
      id: 5,
      groupId: 3,
      groupName: 'DELIVERED',
      name: 'DELIVERED_TO_HANDSET',
      description: 'Message delivered to handset'
    },
    error: {
      groupId: 0,
      groupName: 'OK',
      id: 0,
      name: 'NO_ERROR',
      description: 'No Error',
      permanent: false
    }
  };

  var response;

  //prepare single message delivery report
  if (options.messageId) {
    var report = _.merge({}, template, {
      messageId: options.messageId,
      bulkId: options.bulkId
    });

    response = {
      results: [report]
    };
  }

  //prepare multi message delivery report
  else {
    var limit = options.limit || 50;

    var reports = _.range(0, limit).map(function () {
      return _.merge({}, template, {
        bulkId: options.bulkId
      });
    });

    response = {
      results: reports
    };
  }

  done(null, response);
};