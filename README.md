# bipsms 

[![build status](https://secure.travis-ci.org/lykmapipo/bipsms.png)](http://travis-ci.org/lykmapipo/bipsms)

Send SMS(s), query their delivery status and sending history(logs) in nodejs using infobip JSON API.

## Installation
``` bash
$ npm install bipsms --save
```

## Usage
Firstly, you'll need a valid [Infobip account](https://accounts.infobip.com/signup). When you sign up for the account, you will set a username and password.

### Send single SMS to single destination

### Send single SMS to multiple destination

### Send multiple SMS to multiple destination

### Delivery report

### Sent history (Logs)
To obtain SMS(s) sent history(log). Instantiate `bipsms` with your account details then invoke `getLogs(options,callback(error,logs))` where
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

* Then run integration test
Make sure you have put your account details in the `intergration.js` in `test/intergration` then run it

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