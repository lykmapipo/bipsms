'use strict';

//dependencies
var _ = require('lodash');
var { v4: uuidv4 } = require('uuid');
var randomNumber = require('random-number');


module.exports = exports = function (sms, done) {
  //normalize arguments
  var isFeatured = sms.bulkId ? true : false;

  //received sms template
  var template = {
    to: String(randomNumber({
      min: 11111111111,
      max: 99999999999,
      integer: true
    })),
    status: {
      groupId: 0,
      groupName: 'ACCEPTED',
      id: 0,
      name: 'MESSAGE_ACCEPTED',
      description: 'Message accepted'
    },
    smsCount: 1,
    messageId: uuidv4()
  };

  //process messages and build response
  var response;

  //handle non-featured send
  if (!isFeatured) {
    //prepare single sms to single destination response
    if (_.isPlainObject(sms) && _.isString(sms.to)) {

      var message = _.merge({}, template, {
        to: sms.to
      });

      response = {
        messages: [message]
      };

    }

    //prepare single sms to multiple destination response
    else if (_.isPlainObject(sms) && _.isArray(sms.to)) {

      var messages = _.map(sms.to, function (to) {
        return _.merge({}, template, {
          to: to
        });
      });

      response = {
        bulkId: uuidv4(),
        messages: messages
      };
    }

    //prepare multi sms response
    else {
      var _messages = [];

      _.forEach(sms, function (_sms) {
        //process for single destination
        if (_.isString(_sms.to)) {

          _messages = _messages.concat([
            _.merge({}, template, {
              to: _sms.to
            })
          ]);
        }

        //process for multi destination
        else {

          _messages = _messages.concat(_.map(_sms.to, function (to) {
            return _.merge({}, template, {
              to: to
            });
          }));

        }
      });

      response = {
        bulkId: uuidv4(),
        messages: _messages
      };
    }
  }

  //respond to featured send
  else {
    var $messages = [];

    _.forEach(sms.messages, function (_message) {

      $messages = $messages.concat(_.map(_message.destinations, function (
        destination) {
        return _.merge({}, template, destination);
      }));

    });

    response = {
      bulkId: sms.bulkId || uuidv4(),
      messages: $messages
    };
  }

  done(null, response);
};