# infobip Send Multiple Textual Message JSON API

Send multiple textual messages to one or more destination addresses.

*Note:! Maximum length for one message is 160 characters for GSM7 standard or 70 characters Unicode encoded messages. If you send text which exceeds the maximum number of supported characters for one message, the sent message will be segmented and charged accordingly. One Long SMS that consists of two SMS counts as two SMS.*

## URL
```js
https://api.infobip.com/sms/1/text/multi
```

## Request and Header

### Request Header

#### Single Message - Single Destination
```js
POST /sms/1/text/multi HTTP/1.1
Host: api.infobip.com
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Content-Type: application/json
Accept: application/json

{  
   "messages":[  
      {  
         "from":"InfoSMS",
         "to":[  
            "41793026727",
            "41793026731"
         ],
         "text":"May the Force be with you!"
      },
      {  
         "from":"41793026700",
         "to":"41793026785",
         "text":"A long time ago, in a galaxy far, far away... It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire."
      }
   ]
}
```

#### Single Message - Multiple Destination
```js
POST /sms/1/text/multi HTTP/1.1
Host: api.infobip.com
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Content-Type: application/json
Accept: application/json

{  
   "messages":[  
      {  
         "from":"InfoSMS",
         "to":[  
            "41793026727",
            "41793026731"
         ],
         "text":"May the Force be with you!"
      },
      {  
         "from":"41793026700",
         "to":"41793026785",
         "text":"A long time ago, in a galaxy far, far away... It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire."
      }
   ]
}
``` 

### Request Params
- `from:String` - Represents sender ID and it can be alphanumeric or numeric. Alphanumeric sender ID length should be between 3 and 11 characters (Example: CompanyName). Numeric sender ID length should be between 3 and 14 characters.
- `to:Array of Strings:required` - Array of message destination addresses. If you want to send a message to one destination, a single String is supported instead of an Array. Destination addresses must be in international format (Example: 41793026727).
- `text:String` - Text of the message that will be sent.


## Response and Header
On success, response header HTTP status code will be 200 OK and the message will be sent.

If you try to send message without authorization, you will receive an error 401 Unauthorized.

### SMSResponse
Parameter | Type  |  Description
--- | --- | ---
bulkId | String | The ID that uniquely identifies the request. Bulk ID will be received only when you send a message to more than one destination address.
messages  |  [SMSResponseDetails[]](#smsresponsedetails)  |  Array of sent message objects, one object per every message.

### SMSResponseDetails
Parameter  | Type  |  Description
--- | --- | ---
to | String | The message destination address.
status | [Status](#status) | Indicates whether the message is successfully sent, not sent, delivered, not delivered, waiting for delivery or any other possible status.
smsCount  |  int | The number of sent message segments.
messageId |  String | The ID that uniquely identifies the message sent.

### Status
Parameter  | Type |   Description
--- | --- | ---
groupId | int | Status group ID.
groupName  |  String | Status group name.
id | int | Status ID.
name  |  String | Status name.
description | String | Human readable description of the status.
action | String | Action that should be taken to eliminate the error.

### Response Body

#### Single Message - Single Destination
```js
{  
   "messages":[  
      {  
         "to":"41793026727",
         "status":{  
            "groupId":0,
            "groupName":"Queue/Accepted",
            "id":0,
            "name":"MESSAGE_ACCEPTED",
            "description":"Message accepted"
         },
         "smsCount":1,
         "messageId":"2250be2d4219-3af1-78856-aabe-1362af1edfd2"
      }
   ]
}
```

#### Single Message - Multiple Destination
```js
{  
   "bulkId":"f5c4322c-10e7-a41e-5528-34fa0b032134",
   "messages":[  
      {  
         "to":"41793026727",
         "status":{  
            "groupId":0,
            "groupName":"ACCEPTED",
            "id":0,
            "name":"MESSAGE_ACCEPTED",
            "description":"Message accepted"
         },
         "smsCount":1,
         "messageId":"4a54f0242f19-b832-1c39-a7e7a2095f351ed2"
      },
      {  
         "to":"41793026834",
         "status":{  
            "groupId":0,
            "groupName":"ACCEPTED",
            "id":0,
            "name":"MESSAGE_ACCEPTED",
            "description":"Message accepted"
         },
         "smsCount":1,
         "messageId":"9404a69cef19-7a31-ba39-92ace76a5f351ed2"
      }
   ]
}
```
