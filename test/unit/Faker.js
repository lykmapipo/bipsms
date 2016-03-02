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

        it.skip('should return all current SMS delivery report', function(done) {

            //request account deliveries
            transport.getDeliveryReports(function(error, deliveryReport) {

                expect(error).to.be.null;
                expect(deliveryReport).to.exist;
                expect(deliveryReport.results).to.exist;
                expect(deliveryReport.results.length).to.be.equal(3);

                done();
            });

        });

        it('should return current SMS sent deliveries based on messageId provided', function(done) {
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

                done();
            });

        });

        it.skip('should return current SMS sent deliveries based on bulkId provided', function(done) {

            transport.getDeliveryReports({
                bulkId: '80664c0c-e1ca-414d-806a-5caf146463df'
            }, function(error, deliveryReport) {

                expect(error).to.be.null;
                expect(deliveryReport).to.exist;
                expect(deliveryReport.results).to.exist;
                expect(deliveryReport.results.length).to.be.above(0);

                done();
            });

        });
    });

    it('should be able to get received SMS', function(done) {
        done();
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