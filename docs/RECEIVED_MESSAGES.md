# infobip Received SMS JSON API

Pull received messages

*Note!: [In order to pull received messages, first you need a phone number and to setup a pull action on that number](http://dev.infobip.com/docs/pull-received-messages). Once you retrieve a received message, you will not be able to get the same message again by using this endpoint.*

## URL
```js
https://api.infobip.com/sms/1/inbox/reports
```

## Request and Header
```js
GET /sms/1/inbox/reports HTTP/1.1
Host: api.infobip.com
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Accept: application/json
```

```js
GET /sms/1/inbox/reports?limit=2 HTTP/1.1
Host: api.infobip.com
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Accept: application/json
```

### Request Params
 - `limit:Integer` Maximum number of received messages that will be returned.

## Response and Header
If successful, response header HTTP status code will be 200 OK and the message logs will be returned.

If you try to send message without authorization, you will get a response with HTTP status code 401 Unauthorized.

### Response Body
A response body is an object containing a `results`, which is the collection of sent sms log.

#### SMSResponse
Parameter | Type | Description
--- | --- | ---
results | [Messages[]](#messages) | Collection of reports, one per every received message.

#### Messages
Parameter | Type | Description
--- | --- | ---
messageId | String  | The ID that uniquely identifies the received message.
from | String  |  Sender ID that can be alphanumeric or numeric.
to | String  | The message destination address.
text | String  | Full text of the received message.
cleanText | String | Text of received message without a keyword (if a keyword was sent).
keyword | String | Keyword extracted from the message text.
receivedAt | Date | Tells when the message was received by Infobip platform. Has the following format: yyyy-MM-dd'T'HH:mm:ss.SSSXXX.
smsCount | int  | The number of sent message segments.


#### Example of the response body
```js
{  
   "results":[  
      {  
         "messageId":"df9839ab-6ab6-4abd-984d-ab3b7687e823",
         "from":"38598111",
         "to":"41793026727",
         "text":"KEYWORD Test message",
         "cleanText":"Test message",
         "keyword":"KEYWORD",
         "receivedAt":"2015-02-15T12:23:10.418+0100",
         "smsCount":1
      },
      {  
         "messageId":"ae4359fd-9ad6-4cdf-763d-ac1c5347d839",
         "from":"38598111",
         "to":"41793026727",
         "text":"Test message without keyword.",
         "cleanText":"Test message without keyword.",
         "keyword":"",
         "receivedAt":"2015-02-15T12:21:07.311+0100",
         "smsCount":1
      }
   ]
}
```