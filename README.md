# bipsms 

[![build status](https://secure.travis-ci.org/lykmapipo/bipsms.png)](http://travis-ci.org/lykmapipo/bipsms)

Send SMS(s), query their delivery status and sending history in [nodejs](https://nodejs.org) using [infobip JSON API v1](http://dev.infobip.com/).

*Note:! It strongly recommend using the [E.164 number formatting](https://en.wikipedia.org/wiki/E.164) when sending SMS(s)*

## Installation
``` bash
$ npm install bipsms --save
```

## Usage
Firstly, you'll need a valid [Infobip account](https://accounts.infobip.com/signup). When you sign up for the account, you will get a username and password.

### Send single SMS to single destination
To send single SMS to single destination, instantiate `bipsms` with your account details then invoke `sendSingle(sms,callback(error,response))` where
- `sms` - is an [sms to send](http://dev.infobip.com/docs/send-single-sms)
- `error` - is any error encountered when sending SMS(s)
- `response` - is a response of [sent SMS(s)](http://dev.infobip.com/docs/send-single-sms#section-smsresponse)

#### Example
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

//prepare sms
var sms = {
            from: 'InfoSMS',
            to: '41793026727',
            text: 'Test SMS.'
        };

//send SMS
transport.sendSingle(sms, function(error, response) {

    expect(error).to.be.null;
    expect(response).to.exist;
    expect(response.messages).to.exist;

});
```

### Send single SMS to multiple destination
To send single SMS to multiple destination, instantiate `bipsms` with your account details then invoke `sendSingle(sms,callback(error,response))` where
- `sms` - is an [sms to send](http://dev.infobip.com/docs/send-single-sms#section-single-textual-message-to-multiple-destinations)
- `error` - is any error encountered when sending SMS(s)
- `response` - is a response of [sent SMS(s)](http://dev.infobip.com/docs/send-single-sms#section-smsresponse)

#### Example
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

//prepare SMS
var sms = {
            from: 'InfoSMS',
            to: [
                '41793026727',
                '41793026834'
            ],
            text: 'Test SMS.'
        };

//send SMS
transport.sendSingle(sms, function(error, response) {

    expect(error).to.be.null;
    expect(response).to.exist;
    expect(response.messages).to.exist;

});
```

### Send multiple SMS to multiple destination
To send multiple SMS, instantiate `bipsms` with your account details then invoke `sendMulti(sms,callback(error,response))` where
- `sms` - is a collection of [SMS(s)](http://dev.infobip.com/docs/send-multiple-sms) to send
- `error` - is any error encountered when sending SMS(s)
- `response` - is a response of [sent SMS(s)](http://dev.infobip.com/docs/send-multiple-sms#section-smsresponse)

#### Example
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

//prepare sms(s) to send
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

//send sms(s)
transport.sendMulti(sms, function(error, response) {

    expect(error).to.be.null;
    expect(response).to.exist;
    expect(response.messages).to.exist;

});
```


### Delivery report
To obtain SMS(s) delivery reports, instantiate `bipsms` with your account details then invoke `getDeliveryReport(options,callback(error,logs))` where
- `options` - are valid [request parameters](http://dev.infobip.com/docs/delivery-reports) to be supplied on the request 
- `error` - is any error encountered during requesting SMS(s) sent delivery report
- `deliveryReport` - is SMS(s) [sent delivery reports](http://dev.infobip.com/docs/delivery-reports#section-smsreportresponse)

*Note!: Delivery reports can only be retrieved one time. Once you retrieve a delivery report, you will not be able to get the same report again by using this endpoint.*

#### Example - Request all delivery reports
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

transport.getDeliveryReport(function(error, deliveryReport) {

            expect(error).to.be.null;
            expect(deliveryReport).to.exist;
            expect(deliveryReport.results).to.exist;

        });
```

#### Example - Request delivery report with parameters specified
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

transport.getDeliveryReport({
            bulkId: '<bulkId>'
        },function(error, deliveryReport) {

            expect(error).to.be.null;
            expect(deliveryReport).to.exist;
            expect(deliveryReport.results).to.exist;

        });
```


### Sent history (Logs)
To obtain SMS(s) sent history(log), instantiate `bipsms` with your account details then invoke `getLogs(options,callback(error,logs))` where
- `options` - are valid [request parameters](http://dev.infobip.com/docs/message-logs) to be supplied on the request 
- `error` - is any error encountered during requesting SMS(s) sent history/logs
- `logs` - is SMS(s) [sent history / logs](http://dev.infobip.com/docs/message-logs#section-response-format)

*Note!: SMS logs are available for the last 48 hours!*

#### Example - Request all sent history / logs
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

transport.getLogs(function(error, logs) {

            expect(error).to.be.null;
            expect(logs).to.exist;
            expect(logs.results).to.exist;

        });
```

#### Example - Request logs with parameters specified
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

transport.getLogs({
            bulkId: '<bulkId>'
        },function(error, logs) {

            expect(error).to.be.null;
            expect(logs).to.exist;
            expect(logs.results).to.exist;

        });
```

### Receive SMS
To obtain received SMS(s), instantiate `bipsms` with your account details then invoke `getReceivedLogs(options,callback(error,receivedSMS))` where
- `options` - are valid [request parameters](http://dev.infobip.com/docs/pull-received-messages) to be supplied on the request 
- `error` - is any error encountered during requesting received SMS(s)
- `receivedSMS` - are SMS(s) [received](http://dev.infobip.com/docs/pull-received-messages#section-smsresponse)

#### Example - Request all received SMS(s)
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

transport.getReceived(function(error, receivedSMS) {

            expect(error).to.be.null;
            expect(receivedSMS).to.exist;
            expect(receivedSMS.results).to.exist;

        });
```

#### Example - Request received SMS(s) with parameters specified
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

transport.getReceived({
            limit: '<limit>'
        },function(error, receivedSMS) {

            expect(error).to.be.null;
            expect(receivedSMS).to.exist;
            expect(receivedSMS.results).to.exist;

        });
```


### Received SMS Log
To obtain received SMS(s) logs, instantiate `bipsms` with your account details then invoke `getReceivedLogs(options,callback(error,logs))` where
- `options` - are valid [request parameters](http://dev.infobip.com/docs/received-messages-logs) to be supplied on the request 
- `error` - is any error encountered during requesting received SMS(s) logs
- `logs` - are SMS(s) [received logs](http://dev.infobip.com/docs/received-messages-logs#section-mologsresponse)

*Note!: Received messages logs are available for the last 48 hours!*

#### Example - Request all received SMS(s) logs
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

transport.getReceivedLogs(function(error, logs) {

            expect(error).to.be.null;
            expect(logs).to.exist;
            expect(logs.results).to.exist;

        });
```

#### Example - Request received SMS(s) logs with parameters specified
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

transport.getReceivedLogs({
            limit: '<limit>'
        },function(error, logs) {

            expect(error).to.be.null;
            expect(logs).to.exist;
            expect(logs.results).to.exist;

        });
```

### Account balance
To obtain your account balance, instantiate `bipsms` with your account details and invoke `getBalance(callback(error,balance))` where
- `error` - is any error encountered during requesting account balance
- `balance` - is a balance object with `balance` and `currency` as its properties.

#### Example
```js
var Transport = require('bipsms');
var transport = new Transport({username:'<username>',password:'<password>'});

//then request your account balance
 transport.getBalance(function(error, balance) {

            expect(error).to.be.null;
            expect(balance).to.exist;
            expect(balance.balance).to.equal(5);
            expect(balance.currency).to.equal('EUR');

        });
```

## Testing

* Clone this repository

* Install all development dependencies

```sh
$ npm install
```

* Then run unit test

```sh
$ npm test
```

### Integration test
Make sure you have put your account details in `test/intergration/account.json` in the format
```js
{
    "username": "<username>",
    "password": "<password>"
}
```
then run intergration test task as

```sh
$ grunt intergration
```


## Contribute
Fork this repo and push in your ideas and do not forget to add a bit of test(s) of what value you adding.

## Licence

The MIT License (MIT)

Copyright (c) 2015 lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 