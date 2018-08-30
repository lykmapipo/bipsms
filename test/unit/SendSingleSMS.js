'use strict';

//dependencies
var path = require('path');
var nock = require('nock');
var faker = require('faker');
var expect = require('chai').expect;
var Transport = require(path.join(__dirname, '..', '..'));
var single =
  require(path.join(__dirname, 'fixtures',
    'send_single_one_destination_response.json'));
var multi =
  require(path.join(__dirname, 'fixtures',
    'send_single_multi_destination_response.json'));

//TODO test for alternative flow

describe('Send Single SMS', function () {

  it('should have /sms/1/text/single as send single sms url', function (
    done) {
    var transport = new Transport();

    expect(transport.sendSingleUrl).to.equal('/sms/1/text/single');

    done();
  });


  it('should return unauthorized error when invalid credentials provided',
    function (done) {
      var transport = new Transport({
        username: faker.internet.userName(),
        password: faker.internet.password()
      });

      var sms = {
        from: 'InfoSMS',
        to: '41793026727',
        text: 'Test SMS.'
      };

      nock(transport.baseUrl)
        .post(transport.sendSingleUrl)
        .reply(function ( /*uri, requestBody*/ ) {
          //assert headers
          expect(this.req.headers.accept).to.equal('application/json');
          expect(this.req.headers['content-type']).to.equal(
            'application/json');
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
      transport.sendSingleSMS(sms, function (error, response) {

        expect(response).to.be.undefined;
        expect(error).to.exist;
        expect(error.code).to.equal(401);
        expect(error.name).to.equal('UNAUTHORIZED');
        expect(error.message).to.equal('Invalid login details');

        done();
      });
    });

  it('should send a single sms to a single destination', function (done) {
    var transport = new Transport({
      username: faker.internet.userName(),
      password: faker.internet.password()
    });

    var sms = {
      from: 'InfoSMS',
      to: '41793026727',
      text: 'Test SMS.'
    };


    nock(transport.baseUrl)
      .post(transport.sendSingleUrl)
      .reply(function (uri, requestBody) {
        //assert headers
        expect(this.req.headers.accept).to.equal('application/json');
        expect(this.req.headers['content-type']).to.equal(
          'application/json');
        expect(this.req.headers.host).to.equal('api.infobip.com');
        expect(this.req.headers.authorization).to.not.be.null;

        //assert request body
        expect(requestBody).to.exist;
        expect(requestBody).to.eql(sms);

        return [200, single];
      });

    //send a single sms to a single destination
    transport.sendSingleSMS(sms, function (error, response) {

      expect(error).to.be.null;
      expect(response).to.exist;
      expect(response.messages).to.exist;
      expect(response.messages.length).to.be.equal(1);

      done();
    });

  });

  it('should send a single sms to multiple destination', function (done) {
    var transport = new Transport({
      username: faker.internet.userName(),
      password: faker.internet.password()
    });

    var sms = {
      from: 'InfoSMS',
      to: [
        '41793026727',
        '41793026834'
      ],
      text: 'Test SMS.'
    };

    nock(transport.baseUrl)
      .post(transport.sendSingleUrl)
      .reply(function (uri, requestBody) {
        //assert headers
        expect(this.req.headers.accept).to.equal('application/json');
        expect(this.req.headers['content-type']).to.equal(
          'application/json');
        expect(this.req.headers.host).to.equal('api.infobip.com');
        expect(this.req.headers.authorization).to.not.be.null;

        //assert request body
        expect(requestBody).to.exist;
        expect(requestBody).to.eql(sms);

        return [200, multi];
      });

    //send single sms to multiple destination
    transport.sendSingleSMS(sms, function (error, response) {

      expect(error).to.be.null;
      expect(response).to.exist;
      expect(response.messages).to.exist;
      expect(response.messages.length).to.be.equal(2);

      done();
    });

  });

});