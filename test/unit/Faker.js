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

    it('should be able to get SMS delivery reports', function(done) {
        done();
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