'use strict';

/**
 * Note!:This integration test was performed with new acount.
 * Please replace all expected response with yours
 */

//dependencies
var expect = require('chai').expect;
var _ = require('lodash');
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

            expect(balance.balance).to.be.at.most(expectedBalance.balance);
            expect(balance.currency).to.be.equal(expectedBalance.currency);

            done(error, balance);
        });
    });

    it('should to send send single sms to single destination', function(done) {
        var to = intergration.singleSingleSMS.single.to;
        var from = intergration.from;
        var smsCount = 1;

        transport.sendSingleSMS({
            to: to,
            from: from,
            text: 'TEST'
        }, function(error, sentResult) {

            expect(error).to.not.exist;
            expect(sentResult).to.exist;
            expect(sentResult.messages).to.exist;

            var sentSMS = _.first(sentResult.messages);

            expect(sentSMS).to.exist;
            expect(sentSMS.to).to.be.equal(to);
            expect(sentSMS.smsCount).to.be.equal(smsCount);
            expect(sentSMS.messageId).to.exist;
            expect(sentSMS.status).to.exist;

            done(error, sentResult);
        });

    });

    it('should to send send single sms to multiple destinations', function(done) {
        var to = intergration.singleSingleSMS.multi.to;
        var from = intergration.from;
        var smsCount = 1;

        transport.sendSingleSMS({
            to: to,
            from: from,
            text: 'TEST'
        }, function(error, sentResult) {

            expect(error).to.not.exist;
            expect(sentResult).to.exist;
            expect(sentResult.messages).to.exist;

            var sentSMS = _.first(sentResult.messages);

            expect(sentSMS).to.exist;
            expect(sentSMS.to).to.be.equal(_.first(to));
            expect(sentSMS.smsCount).to.be.equal(smsCount);
            expect(sentSMS.messageId).to.exist;
            expect(sentSMS.status).to.exist;

            done(error, sentResult);
        });

    });

    it('should send multiple sms(s) to multiple destinations', function(done) {
        var to = intergration.sendMultiSMS.to;
        var from = intergration.from;
        var smsCount = 1;

        transport.sendMultiSMS({
                messages: [{
                    to: to,
                    from: from,
                    text: 'TEST'
                }]
            },
            function(error, sentResult) {

                expect(error).to.not.exist;
                expect(sentResult).to.exist;
                expect(sentResult.bulkId).to.exist;
                expect(sentResult.messages).to.exist;

                var sentSMS = _.first(sentResult.messages);

                expect(sentSMS).to.exist;
                expect(sentSMS.to).to.be.equal(_.first(to));
                expect(sentSMS.smsCount).to.be.equal(smsCount);
                expect(sentSMS.messageId).to.exist;
                expect(sentSMS.status).to.exist;

                done(error, sentResult);
            });

    });

    it('should be able to query for sms(s) delivery reports', function(done) {

        transport.getDeliveryReports(function(error, deliveryReports) {

            expect(error).to.not.exist;
            expect(deliveryReports).to.exist;
            expect(deliveryReports.results.length).to.be.at.least(0);

            //TODO more application specific assertions

            done(error, deliveryReports);
        });
    });

    it('should be able to query sms(s) sent logs', function(done) {

        transport.getSentSMSLogs(function(error, sentSMSLogs) {

            expect(error).to.not.exist;
            expect(sentSMSLogs).to.exist;
            expect(sentSMSLogs.results.length).to.be.at.least(0);

            //TODO more application specific assertions

            done(error, sentSMSLogs);
        });
    });

    it('should be able to query for received sms(s)', function(done) {

        transport.getReceivedSMS(function(error, receivedSMS) {

            expect(error).to.not.exist;
            expect(receivedSMS).to.exist;
            expect(receivedSMS.results.length).to.be.at.least(0);

            //TODO more application specific assertions

            done(error, receivedSMS);
        });
    });


    it('should be able to query for received sms(s) logs', function(done) {

        transport.getReceivedSMSLogs(function(error, receivedSMSLogs) {

            expect(error).to.not.exist;
            expect(receivedSMSLogs).to.exist;
            expect(receivedSMSLogs.results.length).to.be.at.least(0);

            //TODO more application specific assertions

            done(error, receivedSMSLogs);
        });
    });
});