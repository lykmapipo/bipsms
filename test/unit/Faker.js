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
                expect(receivedSMS.results.length).to.be.equal(1);

                done();
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

                done();
            });

        });
    });

    it('should be able to query received SMS Log', function(done) {
        done();
    });

    it('should be able to send multipe SMS', function(done) {
        done();
    });

    it('should be able to send single SMS', function(done) {
        done();
    });

    it('should be able to query send SMS Log', function(done) {
        done();
    });

});