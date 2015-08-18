'use strict';

//dependencies
var expect = require('chai').expect;
var path = require('path');
var Transport = require(path.join(__dirname, '..', '..'));

describe('Transport', function() {

    it('should export functional constructor', function(done) {

        expect(Transport).to.be.a('function');

        done();
    });

    it('should have a default base url equals to https://api.infobip.com', function(done) {
        var transport = new Transport();

        expect(transport.baseUrl).to.be.equal('https://api.infobip.com');

        done();
    });

    it('should have username and password undefined by default', function(done) {
        var transport = new Transport();

        expect(transport.username).to.be.undefined;
        expect(transport.password).to.be.undefined;

        done();
    });


    it('should receive `No username and password provided` error when fail to build authorization token', function(done) {
        var transport = new Transport();

        transport.getAuthorizationToken(function(error, token) {

            expect(token).to.be.undefined;
            expect(error).to.exist;
            expect(error.message).to.equal('No username or password provided');

            done();
        });

    });

});