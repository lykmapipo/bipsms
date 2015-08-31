'use strict';

//dependencies
var path = require('path');
var _ = require('lodash');
var nock = require('nock');
var faker = require('faker');
var url = require('url-querystring');
var expect = require('chai').expect;
var Transport = require(path.join(__dirname, '..', '..'));
var logs = require(path.join(__dirname, 'fixtures', 'logs.json'));

//TODO test for alternative flow

describe('Sent SMS Logs', function() {

    it('should have /sms/1/logs as default logs url', function(done) {
        var transport = new Transport();

        expect(transport.logsUrl).to.equal('/sms/1/logs');

        done();
    });


    it('should return unauthorized error when invalid credentials provided', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.logsUrl)
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

        //request account logs
        transport.getSentSMSLogs(function(error, logs) {

            expect(logs).to.be.undefined;
            expect(error).to.exist;
            expect(error.code).to.equal(401);
            expect(error.name).to.equal('UNAUTHORIZED');
            expect(error.message).to.equal('Invalid login details');

            done();
        });

    });

    it('should return all current SMS sent logs', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.logsUrl)
            .reply(function( /*uri, requestBody*/ ) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                return [200, logs];
            });

        //request all account logs
        transport.getSentSMSLogs(function(error, logs) {

            expect(error).to.be.null;
            expect(logs).to.exist;
            expect(logs.results).to.exist;
            expect(logs.results.length).to.be.equal(3);

            done();
        });

    });

    it('should return current SMS sent logs based on options provided', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

        nock(transport.baseUrl)
            .get(transport.logsUrl)
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
                    results: _.filter(logs.results, query) //filter logs based on query
                }];
            });

        //request account logs
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