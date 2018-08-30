'use strict';

//dependencies
var expect = require('chai').expect;
var faker = require('faker');
var path = require('path');
var Transport = require(path.join(__dirname, '..', '..'));

describe('Transport', function () {

  it('should export functional constructor', function (done) {

    expect(Transport).to.be.a('function');

    done();
  });

  it('should have a default base url equals to https://api.infobip.com',
    function (done) {
      var transport = new Transport();

      expect(transport.baseUrl).to.be.equal('https://api.infobip.com');

      done();
    });

  it('should have username and password undefined by default', function (
    done) {
    var transport = new Transport();

    expect(transport.username).to.be.undefined;
    expect(transport.password).to.be.undefined;

    done();
  });


  it(
    'should receive `No username and password provided` error when fail to build authorization token',
    function (done) {
      var transport = new Transport();

      transport.getAuthorizationToken(function (error, token) {

        expect(token).to.be.undefined;
        expect(error).to.exist;
        expect(error.message).to.equal(
          'No username or password provided');

        done();
      });

    });

  it('should be able to parse a given json string safely', function (done) {
    var data = faker.helpers.userCard();
    var dataAsString = JSON.stringify(data);

    var transport = new Transport();
    var dataAsJson = transport._parse(dataAsString);

    expect(dataAsJson).to.eql(data);

    done();
  });


  it('should be able to parse a given json object safely', function (done) {
    var data = faker.helpers.userCard();

    var transport = new Transport();
    var dataAsJson = transport._parse(data);

    expect(dataAsJson).to.eql(data);

    done();
  });


  it('should be able to merge provided `request` options', function (done) {
    var requestOptions = {
      timeout: 20000
    };

    var transport = new Transport({
      request: requestOptions
    });

    expect(transport.request).to.eql(requestOptions);

    done();
  });

  describe('defaults', function () {

    before(function () {
      process.env.SMS_INFOBIP_USERNAME = 'A6N=';
      process.env.SMS_INFOBIP_PASSWORD = 'A6N=';
    });

    it('should use env defaults to initialize', function (done) {
      var transport = new Transport();

      transport.getAuthorizationToken(function (error, token) {
        expect(error).to.not.exist;
        expect(token).to.exist;
        done(error, token);
      });

    });

    after(function () {
      delete process.env.SMS_INFOBIP_USERNAME;
      delete process.env.SMS_INFOBIP_PASSWORD;
    });

  });

});