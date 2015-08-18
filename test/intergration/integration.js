'use strict';

//dependencies
var expect = require('chai').expect;
var path = require('path');
var Transport = require(path.join(__dirname, '..', '..'));
var account = require(path.join(__dirname, 'account.json'));
var transport = new Transport(account);

describe('Transport Integration', function() {
    it('should be able to check balance current balance', function(done) {
        transport.getBalance(function(error, balance) {
            //expected current balance
            var currentBalance = {
                balance: 5,
                currency: 'EUR'
            };

            expect(balance).to.eql(currentBalance);

            done(error, balance);
        });
    });
    it('should to send send single sms to single destination');
    it('should to send send single sms to multiple destination');
    it('should send multiple sms to multiple destination');
    it('should be able to query for sms delivery status');
    it('should be able to query sms sent history');
    it('should be able to query for recived sms');
    it('should be able to query for recived sms logs');
});