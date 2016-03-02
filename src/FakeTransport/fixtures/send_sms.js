'use strict';

//dependencies
var _ = require('lodash');
var uuid = require('uuid');
var randomNumber = require('random-number');


module.exports = exports = function(sms, done) {

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
        messageId: uuid.v4()
    };

    //process messages and build response
    var response;

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

        var messages = _.map(sms.to, function(to) {
            return _.merge({}, template, {
                to: to
            });
        });

        response = {
            bulkId: uuid.v4(),
            messages: messages
        };
    }

    //prepare multi sms response
    else {
        var _messages = [];

        _.forEach(sms, function(_sms) {
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

                _messages = _messages.concat(_.map(_sms.to, function(to) {
                    return _.merge({}, template, {
                        to: to
                    });
                }));

            }
        });

        response = {
            bulkId: uuid.v4(),
            messages: _messages
        };
    }

    done(null, response);
};