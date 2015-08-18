'use strict';

//dependencies
var path = require('path');
var nock = require('nock');
var faker = require('faker');
var expect = require('chai').expect;
var Transport = require(path.join(__dirname, '..', '..'));

//TODO test for alternative flow

describe('Transport Balance', function() {

    it('should have /account/1/balance as default balance url', function(done) {
        var transport = new Transport();

        expect(transport.balanceUrl).to.equal('/account/1/balance');

        done();
    });


    it('should return unauthorized error when invalid credentials provided', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.balanceUrl)
            .reply(function( /*uri, requestBody*/ ) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                //fake invalid credentials
                return [401, {
                    requestError: {
                        serviceException: {
                            messageId: 'UNAUTHORIZED',
                            text: 'Invalid login details'
                        }
                    }
                }];
            });

        //request account balance
        transport.getBalance(function(error, balance) {

            expect(balance).to.be.undefined;
            expect(error).to.exist;
            expect(error.code).to.equal(401);
            expect(error.name).to.equal('UNAUTHORIZED');
            expect(error.message).to.equal('Invalid login details');

            done();
        });

    });

    it('should return current account balance', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.balanceUrl)
            .reply(function( /*uri, requestBody*/ ) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                return [200, {
                    balance: 5,
                    currency: 'EUR'
                }];
            });

        //request account balance
        transport.getBalance(function(error, balance) {

            expect(error).to.be.null;
            expect(balance).to.exist;
            expect(balance.balance).to.equal(5);
            expect(balance.currency).to.equal('EUR');

            done();
        });

    });

});