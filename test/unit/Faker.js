'use strict';

var expect = require('chai').expect;
// var faker = require('faker');
var path = require('path');
var Transport = require(path.join(__dirname, '..', '..'));
var transport;

describe.only('Fake Transport', function() {

    beforeEach(function() {
        transport = new Transport({
            fake: {
                currency: 'USD',
                pricePerMessage: 0.01,
                balance: {
                    min: 100,
                    max: 200
                }
            }
        });
    });

    it('should be able to flag itself as fake transport', function(done) {
        expect(transport.isFake).to.be.true;
        done();
    });

    it('should be able to get balance', function(done) {

        transport.getBalance(function(error, balance) {

            expect(error).to.be.null;
            expect(balance).to.exist;
            expect(balance.balance).to.exist;
            expect(balance.currency).to.equal('USD');

            done(error, balance);
        });

    });

    describe('Delivery Reports', function() {

        it('should return current SMS sent delivery report(s) based on messageId provided', function(done) {
            var options = {
                messageId: '80664c0c-e1ca-414d-806a-5caf146463df'
            };

            transport.getDeliveryReports(options, function(error, deliveryReport) {

                expect(error).to.be.null;
                expect(deliveryReport).to.exist;
                expect(deliveryReport.results).to.exist;
                expect(deliveryReport.results.length).to.be.above(0);

                //assert message
                expect(deliveryReport.results[0].messageId)
                    .to.equal(options.messageId);

                done(error, deliveryReport);
            });

        });

        it('should return current SMS sent delivery report(s) based on bulkId provided', function(done) {
            var options = {
                bulkId: '80664c0c-e1ca-414d-806a-5caf146463df',
                limit: 5
            };

            transport.getDeliveryReports(options, function(error, deliveryReport) {

                expect(error).to.be.null;
                expect(deliveryReport).to.exist;
                expect(deliveryReport.results).to.exist;
                expect(deliveryReport.results.length).to.be.equal(5);

                //assert bulkId
                expect(deliveryReport.results[0].bulkId)
                    .to.equal(options.bulkId);

                done(error, deliveryReport);
            });

        });
    });

    describe('Received SMS', function() {

        it('should return all received SMS(s) so far', function(done) {
            //request account received SMS(s)
            transport.getReceivedSMS(function(error, receivedSMS) {

                expect(error).to.be.null;
                expect(receivedSMS).to.exist;
                expect(receivedSMS.results).to.exist;
                expect(receivedSMS.results.length).to.be.equal(50);

                done(error, receivedSMS);
            });

        });

        it('should return received SMS(s) based on options provided', function(done) {
            //request account (inbox) received sms
            transport.getReceivedSMS({
                limit: 10
            }, function(error, receivedSMS) {

                expect(error).to.be.null;
                expect(receivedSMS).to.exist;
                expect(receivedSMS.results).to.exist;
                expect(receivedSMS.results.length).to.be.equal(10);

                done(error, receivedSMS);
            });

        });
    });

    describe('Received SMS Log', function() {

        it('should return all received SMS(s) log', function(done) {

            //request account received SMS(s) log
            transport.getReceivedSMSLogs(function(error, receivedSMSLog) {

                expect(error).to.be.null;
                expect(receivedSMSLog).to.exist;
                expect(receivedSMSLog.results).to.exist;
                expect(receivedSMSLog.results.length).to.be.equal(50);

                done(error, receivedSMSLog);
            });

        });

        it('should return received SMS(s) log based on options provided', function(done) {

            //request account (inbox) received sms log
            transport.getReceivedSMSLogs({
                limit: 2
            }, function(error, receivedSMSLog) {

                expect(error).to.be.null;
                expect(receivedSMSLog).to.exist;
                expect(receivedSMSLog.results).to.exist;
                expect(receivedSMSLog.results.length).to.be.equal(2);

                done(error, receivedSMSLog);
            });

        });
    });

    describe('Send Multiple Textual SMS', function() {

        it('should be able to send multiple sms', function(done) {

            var sms = {
                messages: [{
                    from: 'InfoSMS',
                    to: [
                        '41793026727',
                        '41793026731'
                    ],
                    text: 'May the Force be with you!'
                }, {
                    from: '41793026700',
                    to: '41793026785',
                    text: 'A long time ago, in a galaxy far, far away.'
                }]
            };

            //send SMS(s)
            transport.sendMultiSMS(sms, function(error, response) {

                expect(error).to.be.null;
                expect(response).to.exist;
                expect(response.messages).to.exist;
                expect(response.messages.length).to.be.equal(3);

                expect(response.bulkId).to.exist;

                done();
            });

        });
    });

    describe('Send Single Textual SMS', function() {

        it('should send a single sms to a single destination', function(done) {

            var sms = {
                from: 'InfoSMS',
                to: '41793026727',
                text: 'Test SMS.'
            };

            //send a single sms to a single destination
            transport.sendSingleSMS(sms, function(error, response) {

                expect(error).to.be.null;
                expect(response).to.exist;
                expect(response.messages).to.exist;
                expect(response.messages.length).to.be.equal(1);

                done(error, response);
            });

        });

        it('should send a single sms to multiple destination', function(done) {

            var sms = {
                from: 'InfoSMS',
                to: [
                    '41793026727',
                    '41793026834'
                ],
                text: 'Test SMS.'
            };

            //send single sms to multiple destination
            transport.sendSingleSMS(sms, function(error, response) {


                expect(error).to.be.null;
                expect(response).to.exist;
                expect(response.messages).to.exist;
                expect(response.messages.length).to.be.equal(2);

                expect(response.bulkId).to.exist;

                done(error, response);
            });

        });
    });

    describe('Sent SMS Log', function() {

        it('should return all current SMS sent logs', function(done) {

            transport.getSentSMSLogs(function(error, logs) {

                expect(error).to.be.null;
                expect(logs).to.exist;
                expect(logs.results).to.exist;
                expect(logs.results.length).to.be.equal(50);

                done(error, logs);
            });

        });

        it('should return current SMS sent logs based on options provided', function(done) {

            transport.getSentSMSLogs({
                bulkId: '82d1d36e-e4fb-4194-8b93-caeb053bd327'
            }, function(error, logs) {

                expect(error).to.be.null;
                expect(logs).to.exist;
                expect(logs.results).to.exist;
                expect(logs.results.length).to.be.above(0);

                done();
            });

        });
    });

});