'use strict';

//dependencies
var path = require('path');
var nock = require('nock');
var faker = require('faker');
var expect = require('chai').expect;
var Transport = require(path.join(__dirname, '..', '..'));
var single =
    require(path.join(__dirname, 'fixtures', 'send_multi_response.json'));
var multi =
    require(path.join(__dirname, 'fixtures', 'send_multi_multiple_destination_response.json'));

//TODO test for alternative flow

describe('Transport Send Multi', function() {

    it('should have /sms/1/text/multi as send multi sms url', function(done) {
        var transport = new Transport();

        expect(transport.sendMultiUrl).to.equal('/sms/1/text/multi');

        done();
    });


    it('should return unauthorized error when invalid credentials provided', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

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

        nock(transport.baseUrl)
            .post(transport.sendMultiUrl)
            .reply(function( /*uri, requestBody*/ ) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers['content-type']).to.equal('application/json');
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

        //send single sms to single destination
        transport.sendMulti(sms, function(error, response) {

            expect(response).to.be.undefined;
            expect(error).to.exist;
            expect(error.code).to.equal(401);
            expect(error.name).to.equal('UNAUTHORIZED');
            expect(error.message).to.equal('Invalid login details');

            done();
        });
    });

    it('should send multi sms to a single destination', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

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


        nock(transport.baseUrl)
            .post(transport.sendMultiUrl)
            .reply(function(uri, requestBody) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers['content-type']).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                //assert request body
                expect(requestBody).to.exist;
                expect(JSON.parse(requestBody)).to.eql(sms);

                return [200, single];
            });

        //send a single sms to a single destination
        transport.sendMulti(sms, function(error, response) {

            expect(error).to.be.null;
            expect(response).to.exist;
            expect(response.messages).to.exist;
            expect(response.messages.length).to.be.equal(2);

            done();
        });

    });

    it('should send multiple sms to multiple destination', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });

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

        nock(transport.baseUrl)
            .post(transport.sendMultiUrl)
            .reply(function(uri, requestBody) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers['content-type']).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                //assert request body
                expect(requestBody).to.exist;
                expect(JSON.parse(requestBody)).to.eql(sms);

                return [200, multi];
            });

        //send single sms to multiple destination
        transport.sendMulti(sms, function(error, response) {

            expect(error).to.be.null;
            expect(response).to.exist;
            expect(response.messages).to.exist;
            expect(response.messages.length).to.be.equal(3);

            done();
        });

    });

});