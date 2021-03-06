# infobip Delivery Reports JSON API

Get one time delivery reports for sent SMS.

*Note!: Delivery reports can only be retrieved one time. Once you retrieve a delivery report, you will not be able to get the same report again by using this endpoint.*

## URL
```js
GET https://api.infobip.com/sms/1/reports
```

## Request and Header
```js
GET /sms/1/reports HTTP/1.1
Host: api.infobip.com
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Accept: application/json
```

### Request Params
- `bulkId:String` - The ID that uniquely identifies the request. Bulk ID will be received only when you send a message to more than one destination address.
- `messageId:String` - The ID that uniquely identifies the message sent.
- `limit:String` - The maximum number of returned delivery reports.

## Response and Header
If successful, response header HTTP status code will be 200 OK and the message logs will be returned.

If you try to send message without authorization, you will get a response with HTTP status code 401 Unauthorized.

### Response Body
A response body is an object containing a `results`, which is the collection of sent sms report.

#### SMSReportResponse
Parameter | Type | Description
--- | --- | ---
results | [SentSMSReport[]](#sentsmsreport) | Collection of reports, one per every message.

#### SentSMSReport
Parameter | Type | Description
--- | --- | ---
bulkId | String | The ID that uniquely identifies the request.
messageId | String | The ID that uniquely identifies the message sent.
to | String | The message destination address.
from |  String | Sender ID that can be alphanumeric or numeric.
sentAt | Date  | Tells when the SMS was sent. Has the following format: yyyy-MM-dd'T'HH:mm:ss.SSSZ.
doneAt | Date  |  Tells when the SMS was finished processing by Infobip (ie. delivered to destination, delivered to destination network, etc.)
smsCount |  int | The number of sent message segments.
price  | [Price](#price)  | Sent SMS price.
status | [Status](#status) | Indicates whether the message is successfully sent, not sent, delivered, not delivered, waiting for delivery or any other possible status.
error |  [Error](#error) | Indicates whether the error occurred during the query execution.


#### Price
Parameter  | Type  | Description
--- | --- | ---
pricePerMessage | BigDecimal | Price per one SMS.
currency  |  String  | The currency in which the price is expressed.


#### Status
Parameter | Type  |  Description
--- | --- | ---
groupId | int | Status group ID.
groupName | String | Status group name.
id | int | Status ID.
name  |  String | Status name.
description | String | Human readable description of the status.
action | String | Action that should be taken to eliminate the error.


#### Error
Parameter | Type | Description
--- | --- | ---
groupId | int | Error group ID.
groupName  | String | Error group name.
id | int | Error ID.
name | String | Error name.
description | String | Human readable description of the error.
permanent  | boolean | Tells if the error is permanent.

#### Example of the response body
```js
{  
   "results":[  
      {  
         "bulkId":"bafdeb3d-719b-4cce-8762-54d47b40f3c5",
         "messageId":"07e03aae-fabc-44ad-b1ce-222e14094d70",
         "to":"41793026727",
         "from":"InfoSMS",
         "text":"Test SMS.",
         "sentAt":"2015-02-23T17:41:11.833+0100",
         "doneAt":"2015-02-23T17:41:11.843+0100",
         "smsCount":1,
         "mccmnc":"22801",
         "price":{  
            "pricePerMessage":0.01,
            "currency":"EUR"
         },
         "status":{  
            "groupId":3,
            "groupName":"DELIVERED",
            "id":5,
            "name":"DELIVERED_TO_HANDSET",
            "description":"Message delivered to handset"
         },
         "error":{  
            "groupId":0,
            "groupName":"OK",
            "id":0,
            "name":"NO_ERROR",
            "description":"No Error",
            "permanent":false
         }
      },
      {  
         "bulkId":"06479ba3-5977-47f6-9346-fee0369bc76b",
         "messageId":"1f21d8d7-f306-4f53-9f6e-eddfce9849ea",
         "to":"41793026727",
         "from":"InfoSMS",
         "text":"Test SMS.",
         "sentAt":"2015-02-23T17:40:31.773+0100",
         "doneAt":"2015-02-23T17:40:31.787+0100",
         "smsCount":1,
         "mccmnc":"22801",
         "price":{  
            "pricePerMessage":0.01,
            "currency":"EUR"
         },
         "status":{  
            "groupId":3,
            "groupName":"DELIVERED",
            "id":5,
            "name":"DELIVERED_TO_HANDSET",
            "description":"Message delivered to handset"
         },
         "error":{  
            "groupId":0,
            "groupName":"OK",
            "id":0,
            "name":"NO_ERROR",
            "description":"No Error",
            "permanent":false
         }
      }
   ]
}
```