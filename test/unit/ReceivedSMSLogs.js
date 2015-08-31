'use strict';

//dependencies
var path = require('path');
var _ = require('lodash');
var nock = require('nock');
var faker = require('faker');
var url = require('url-querystring');
var expect = require('chai').expect;
var Transport = require(path.join(__dirname, '..', '..'));
var receivedSMSLog = require(path.join(__dirname, 'fixtures', 'received_sms_logs.json'));

//TODO test for alternative flow
//TODO assert request urls

describe('Received SMS Logs', function() {

    it('should have /sms/1/inbox/logs as default received sms log url', function(done) {
        var transport = new Transport();

        expect(transport.receivedLogUrl).to.equal('/sms/1/inbox/logs');

        done();
    });


    it('should return unauthorized error when invalid credentials provided', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.receivedLogUrl)
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

        //request account received SMS(s) log
        transport.getReceivedSMSLogs(function(error, receivedSMSLog) {

            expect(receivedSMSLog).to.be.undefined;
            expect(error).to.exist;
            expect(error.code).to.equal(401);
            expect(error.name).to.equal('UNAUTHORIZED');
            expect(error.message).to.equal('Invalid login details');

            done();
        });

    });

    it('should return all received SMS(s) log', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.receivedLogUrl)
            .reply(function( /*uri, requestBody*/ ) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                return [200, receivedSMSLog];
            });

        //request account received SMS(s) log
        transport.getReceivedSMSLogs(function(error, receivedSMSLog) {

            expect(error).to.be.null;
            expect(receivedSMSLog).to.exist;
            expect(receivedSMSLog.results).to.exist;
            expect(receivedSMSLog.results.length).to.be.equal(4);

            done();
        });

    });

    it('should return received SMS(s) log based on options provided', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.receivedLogUrl)
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
                    results: _.take(receivedSMSLog.results, query.limit)
                }];
            });

        //request account (inbox) received sms log
        transport.getReceivedSMSLogs({
            limit: 2
        }, function(error, receivedSMSLog) {

            expect(error).to.be.null;
            expect(receivedSMSLog).to.exist;
            expect(receivedSMSLog.results).to.exist;
            expect(receivedSMSLog.results.length).to.be.equal(2);

            done();
        });

    });

});