'use strict';

//dependencies
var path = require('path');
var nock = require('nock');
var faker = require('faker');
var url = require('url-querystring');
var expect = require('chai').expect;
var Transport = require(path.join(__dirname, '..', '..'));
var receivedSMS = require(path.join(__dirname, 'fixtures', 'received_sms.json'));

//TODO test for alternative flow
//TODO assert request urls

describe('Transport Received', function() {

    it('should have /sms/1/inbox/reports as default received sms url', function(done) {
        var transport = new Transport();

        expect(transport.receivedUrl).to.equal('/sms/1/inbox/reports');

        done();
    });


    it('should return unauthorized error when invalid credentials provided', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.receivedUrl)
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

        //request account received SMS(s)
        transport.getReceived(function(error, receivedSMS) {

            expect(receivedSMS).to.be.undefined;
            expect(error).to.exist;
            expect(error.code).to.equal(401);
            expect(error.name).to.equal('UNAUTHORIZED');
            expect(error.message).to.equal('Invalid login details');

            done();
        });

    });

    it('should return all received SMS(s) so far', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.receivedUrl)
            .reply(function( /*uri, requestBody*/ ) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                return [200, receivedSMS];
            });

        //request account received SMS(s)
        transport.getReceived(function(error, receivedSMS) {

            expect(error).to.be.null;
            expect(receivedSMS).to.exist;
            expect(receivedSMS.results).to.exist;
            expect(receivedSMS.results.length).to.be.equal(2);

            done();
        });

    });

    it('should return received SMS(s) based on options provided', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.receivedUrl)
            .query(true)
            .reply(function( /*uri, requestBody*/ ) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                //assert query string
                var query = url(this.req.path).qs;
                expect(query).to.exist;

                return [200, {
                    results: [receivedSMS.results[0]]
                }];
            });

        //request account (inbox) received sms
        transport.getReceived({
            limit: 1
        }, function(error, receivedSMS) {

            expect(error).to.be.null;
            expect(receivedSMS).to.exist;
            expect(receivedSMS.results).to.exist;
            expect(receivedSMS.results.length).to.be.above(0);

            done();
        });

    });

});