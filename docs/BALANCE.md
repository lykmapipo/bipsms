# infobip Balance JSON API

Allows obtaining balance of the account

## URL
```js
https://api.infobip.com/account/1/balance
```

## Request and Header
```js
GET /account/1/balance HTTP/1.1
Host: api.infobip.com
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Accept: application/json
```

## Response and Header
On success, response header HTTP status code will be `200 OK` and delivery reports will be returned in the response body.

If you try to send a message without authorization, you will get a response with HTTP status code `401 Unauthorized`.

### Response Body
```js
{
    "balance": 5,
    "currency": "EUR"
}
```
Where:
- `balance:Double` current account balance.
- `currency:String` currency in which the account balance is expressed.