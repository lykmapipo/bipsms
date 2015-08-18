# infobip Received SMS Logs JSON API

Pull received messages logs

*Note!: Received messages logs are available for the last 48 hours!*

## URL
```js
https://api.infobip.com/sms/1/inbox/logs
```

## Request and Header
```js
GET /sms/1/inbox/logs HTTP/1.1
Host: api.infobip.com
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Accept: application/json
```

### Request Params
- `limit:Integer` Maximum number of messages in returned logs.
- `keyword:String` Keyword used in received messages
- `to:String` The message destination address.
- `receivedSince:DateTime` Lower limit on date and time of sending SMS.
- `receivedUntil:DateTime` Upper limit on date and time of sending SMS.

## Response and Header
If successful, response header HTTP status code will be 200 OK and the message logs will be returned.

If you try to send message without authorization, you will get a response with HTTP status code 401 Unauthorized.

### Response Body
A response body is an object containing a `results`, which is the collection of sent sms log.

#### MOLogsResponse
Parameter | Type | Description
--- | --- | ---
results | [MOLog[]](#molog) | Collection of logs.

#### MOLog
Parameter | Type | Description
--- | --- | ---
messageId |  String  | The ID that uniquely identifies the received message.
to | String | The message destination address.
receivedAt | Date | Tells when the SMS was received. Has the following format: yyyy-MM-dd'T'HH:mm:ss.SSSZ.
from | String | Sender ID that can be alphanumeric or numeric.
text | String | Text of the message that was sent.
cleanText | String  | Text of the message that was sent without the keyword.
keyword | String  | Keyword extracted from the message text.
smsCount | int | The number of sent message segments.

#### Example of the response body
```js
{  
   "results":[  
      {  
         "messageId":"5908971644001839114",
         "to":"41793026727",
         "receivedAt":"2015-03-01T12:54:44.560+0000",
         "from":"385998779111",
         "text":"HEY hello world",
         "cleanText":"hello world",
         "keyword":"HEY",
         "smsCount":1
      },
      {  
         "messageId":"5904932597450690569",
         "to":"41793026727",
         "receivedAt":"2015-03-01T12:54:42.231+0000",
         "from":"385998779111",
         "text":"HEY how are you",
         "cleanText":"how are you",
         "keyword":"HEY",
         "smsCount":1
      },
      {  
         "messageId":"5904217701796992008",
         "to":"41793026727",
         "receivedAt":"2015-03-01T12:54:40.111+0000",
         "from":"385998779111",
         "text":"KEY hello world",
         "cleanText":"hello world",
         "keyword":"KEY",
         "smsCount":1
      }
   ]
}
```