'use strict';

//dependencies
var path = require('path');
var _ = require('lodash');
var nock = require('nock');
var faker = require('faker');
var url = require('url-querystring');
var expect = require('chai').expect;
var Transport = require(path.join(__dirname, '..', '..'));
var deliveries = require(path.join(__dirname, 'fixtures', 'deliveries.json'));

//TODO test for alternative flow

describe('Delivery Reports', function () {

  it('should have /sms/1/reports as default delivery url', function (done) {
    var transport = new Transport();

    expect(transport.deliveryReportUrl).to.equal('/sms/1/reports');

    done();
  });


  it('should return unauthorized error when invalid credentials provided',
    function (done) {
      var transport = new Transport({
        username: faker.internet.userName(),
        password: faker.internet.password()
      });

      nock(transport.baseUrl)
        .get(transport.deliveryReportUrl)
        .reply(function ( /*uri, requestBody*/ ) {
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

      //request account deliveries
      transport.getDeliveryReports(function (error, deliveryReport) {

        expect(deliveryReport).to.be.undefined;
        expect(error).to.exist;
        expect(error.code).to.equal(401);
        expect(error.name).to.equal('UNAUTHORIZED');
        expect(error.message).to.equal('Invalid login details');

        done();
      });

    });

  it('should return all current SMS delivery report', function (done) {
    var transport = new Transport({
      username: faker.internet.userName(),
      password: faker.internet.password()
    });

    nock(transport.baseUrl)
      .get(transport.deliveryReportUrl)
      .reply(function ( /*uri, requestBody*/ ) {
        //assert headers
        expect(this.req.headers.accept).to.equal('application/json');
        expect(this.req.headers.host).to.equal('api.infobip.com');
        expect(this.req.headers.authorization).to.not.be.null;

        return [200, deliveries];
      });

    //request account deliveries
    transport.getDeliveryReports(function (error, deliveryReport) {

      expect(error).to.be.null;
      expect(deliveryReport).to.exist;
      expect(deliveryReport.results).to.exist;
      expect(deliveryReport.results.length).to.be.equal(3);

      done();
    });

  });

  it('should return current SMS sent deliveries based on options provided',
    function (done) {
      var transport = new Transport({
        username: faker.internet.userName(),
        password: faker.internet.password()
      });

      nock(transport.baseUrl)
        .get(transport.deliveryReportUrl)
        .query(true)
        .reply(function ( /*uri, requestBody*/ ) {
          //assert headers
          expect(this.req.headers.accept).to.equal('application/json');
          expect(this.req.headers.host).to.equal('api.infobip.com');
          expect(this.req.headers.authorization).to.not.be.null;

          //assert query string
          var query = url(this.req.path).qs;
          expect(query).to.exist;

          return [200, {
            results: _.filter(deliveries.results, query) //filter deliveries based on query
          }];
        });

      //request account deliveries
      transport.getDeliveryReports({
        bulkId: '80664c0c-e1ca-414d-806a-5caf146463df'
      }, function (error, deliveryReport) {

        expect(error).to.be.null;
        expect(deliveryReport).to.exist;
        expect(deliveryReport.results).to.exist;
        expect(deliveryReport.results.length).to.be.above(0);

        done();
      });

    });

});