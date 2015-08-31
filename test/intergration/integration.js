'use strict';

/**
 * Note!:This integration test was performed with new acount.
 * Please replace all expected response with yours
 */

//dependencies
var expect = require('chai').expect;
var path = require('path');
var Transport = require(path.join(__dirname, '..', '..'));
var intergration = require(path.join(__dirname, 'intergration.json'));
var transport = new Transport(intergration.account);

describe('Integration', function() {

    it('should be able to check current balance', function(done) {
        transport.getBalance(function(error, balance) {

            //place your expected current balance
            var expectedBalance = {
                balance: 5,
                currency: 'EUR'
            };

            expect(balance).to.eql(expectedBalance);

            done(error, balance);
        });
    });

    it('should to send send single sms to single destination');
    it('should to send send single sms to multiple destinations');
    it('should send multiple sms(s) to multiple destinations');

    it('should be able to query for sms(s) delivery reports', function(done) {
        var expectedDeliveryReports = {
            results: []
        };

        transport.getDeliveryReports(function(error, deliveryReports) {

            expect(error).to.not.exist;
            expect(deliveryReports).to.exist;
            expect(deliveryReports).to.eql(expectedDeliveryReports);

            done(error, deliveryReports);
        });
    });

    it('should be able to query sms(s) sent logs', function(done) {
        var exptectedSentSMSLogs = {
            results: []
        };

        transport.getSentSMSLogs(function(error, sentSMSLogs) {

            expect(error).to.not.exist;
            expect(sentSMSLogs).to.exist;
            expect(sentSMSLogs).to.eql(exptectedSentSMSLogs);

            done(error, sentSMSLogs);
        });
    });

    it('should be able to query for received sms(s)', function(done) {
        //place your expected received sms
        var expectedReceivedSMS = {
            results: []
        };

        transport.getReceivedSMS(function(error, receivedSMS) {

            expect(error).to.not.exist;
            expect(receivedSMS).to.exist;
            expect(receivedSMS).to.eql(expectedReceivedSMS);

            done(error, receivedSMS);
        });
    });


    it('should be able to query for received sms(s) logs', function(done) {
        //place your expected logs here
        var expectedReceivedSMSLogs = {
            results: []
        };

        transport.getReceivedSMSLogs(function(error, receivedSMSLogs) {

            expect(error).to.not.exist;
            expect(receivedSMSLogs).to.exist;
            expect(receivedSMSLogs).to.eql(expectedReceivedSMSLogs);

            done(error, receivedSMSLogs);
        });
    });
});