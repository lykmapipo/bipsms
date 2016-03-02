'use strict';

//dependencies
var path = require('path');
var nock = require('nock');
var faker = require('faker');
var expect = require('chai').expect;
var Transport = require(path.join(__dirname, '..', '..'));

var sms =
    require(path.join(__dirname, 'fixtures', 'fully_featured_textual_message_request.json'));

var featured =
    require(path.join(__dirname, 'fixtures', 'send_fully_featured_textual_message_response.json'));


//TODO test for alternative flow

describe('Send Featured SMS', function() {

    it('should have /sms/1/text/advanced as send single sms url', function(done) {
        var transport = new Transport();

        expect(transport.sendFeaturedUrl).to.equal('/sms/1/text/advanced');

        done();
    });

    it('should send a featured SMS', function(done) {
        var transport = new Transport({
            username: faker.internet.userName(),
            password: faker.internet.password()
        });


        nock(transport.baseUrl)
            .post(transport.sendFeaturedUrl)
            .reply(function(uri, requestBody) {
                //assert headers
                expect(this.req.headers.accept).to.equal('application/json');
                expect(this.req.headers['content-type']).to.equal('application/json');
                expect(this.req.headers.host).to.equal('api.infobip.com');
                expect(this.req.headers.authorization).to.not.be.null;

                //assert request body
                expect(requestBody).to.exist;
                expect(JSON.parse(requestBody)).to.eql(sms);

                return [200, featured];
            });

        transport.sendFeaturedSMS(sms, function(error, response) {

            expect(error).to.be.null;
            expect(response).to.exist;
            expect(response.messages).to.exist;
            expect(response.messages.length).to.be.equal(3);

            done();
        });

    });

});