[![NPM](https://nodei.co/npm/dailyconnect.png?compact=true)](https://nodei.co/npm/dailyconnect/)

dailyconnect
============

Node JavaScript API to access data from Daily Connect. I built this mainly for myself so I could get pictures of my son  pushed via a slackbot. :) Feel free to use and enhance as needed (patches always welcome).


API
----
All functions accept [Error-First callbacks](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/) with the response data as the second argument.

**var dc = new DailyConnect(user, pass)**
instantiate a new instance with the supplied user/pass

**dc.login(callback)**
Call the login service. This call must be performed before using any other functions. Returns error as first argument to the `callback` if login failed.

**dc.getUserInfo(callback)**
Return the info of the logged in user.
Sample response:
```javascript
{
  "Name": "John Doe",
  "Ut": 1,
  "Email": "fake@fakey.nope",
  "created": "5/12/2014",
  "myKids": [{
    "Name": "Baby Doe",
    "Created": 140512,
    "Contacts": [{
      "phone": "8005551212",
      "name": "Some name-  home"
    }],
    "PhotoInd": 2,
    "Id": 1234567890123456,
    "Parents": [{
      "Name": "John Doe",
      "Ut": 1,
      "Email": "fake@fakey.nope",
      "Id": 6543210987654321
    }, {
      "Name": "Jane Doe",
      "Ut": 1,
      "Email": "alsofake@fakey.nope",
      "Id": 1231231231231231
    }, {
      "Name": "Great Preschool Room 1",
      "Ut": 10,
      "Email": "fakeschool@fakey.nope",
      "Id": 9879879879879879,
      "cc": [6767676767676767]
    }, {
      "Name": "Great Preschool-SomeCity",
      "Type": 2,
      "ccId": 6767676767676767,
      "Id": 6767676767676767
    }],
    "Boy": true,
    "Allergies": "",
    "Photo": 5656565656565656,
    "BDay": "10/26/2011"
  }],
  "nws": true,
  "Id": 6543210987654321
}
```

  **dc.getKidSummary(kidId, callback)**
Return a summary for the specified kidId for today.

**dc.getKidSummaryByDay(kidId, inDate, callback)**
Return a summary for the specified kidId for a specific date.

kid summary Sample output:
```javascript
{
  "summary": {
    "totalSleepDuration": 130,
    "timeOfLastSleeping": "10/22/2014 14:53",
    "kidId": 1234567890123456,
    "timeOfLastFood": "10/22/2014 11:33",
    "nrOfSleep": 1,
    "longuestSleepDuration": 130,
    "day": 141022,
    "timeOfLastDropOff": "10/22/2014 7:45",
    "isSleeping": false
  }
}
```

**dc.getKidStatus(kidId, callback)**
Return the summary and a detailed list of events for the specified kidId for today.

**dc.getKidStatusByDay(kidId, inDate, callback)**
Return the summary and a detailed list of events for the specified kidId a specific date

kid status sample output:
```javascript
{
  "summary": {
    "totalSleepDuration": 130,
    "timeOfLastSleeping": "10/22/2014 14:53",
    "kidId": 1234567890123456,
    "timeOfLastFood": "10/22/2014 11:33",
    "nrOfSleep": 1,
    "longuestSleepDuration": 130,
    "day": 141022,
    "timeOfLastDropOff": "10/22/2014 7:45",
    "isSleeping": false
  },
  "staff": [],
  "users": [{
    "Name": "Great Preschool Room 1",
    "Ut": 10,
    "Email": "fakepreschoo@fakey.nope",
    "Id": 9879879879879879,
    "cc": [6767676767676767]
  }],
  "ts": 166481228455,
  "kidId": 1234567890123456,
  "pdt": 141022,
  "list": [{
    "By": 9879879879879879,
    "Kid": 1234567890123456,
    "Ptm": 1010,
    "e": "10/22/2014 09:45",
    "Cat": 101,
    "Txt": "Baby Doe  is dropped off",
    "ms": 166464259139,
    "lId": 145293057051,
    "Utm": 945,
    "isst": 1,
    "Id": 1509600413,
    "Pdt": 141022
  }, {
    "By": 9879879879879879,
    "Kid": 1234567890123456,
    "Ptm": 1010,
    "e": "10/22/2014 10:01",
    "Cat": 700,
    "Txt": "Baby Doe  is on the playground ",
    "ms": 166464248036,
    "lId": 145293043669,
    "Utm": 1001,
    "isst": 1,
    "Id": 1496860453,
    "Pdt": 141022
  }, {
    "By": 9879879879879879,
    "Ptm": 1253,
    "e": "10/22/2014 10:50",
    "ms": 166474032684,
    "n": "Apple bobbing- the kids used tongs to bob for apples. This activity worked on hand-eye coordination and fine motor skills.",
    "lId": 145302826419,
    "isst": 1,
    "Pdt": 141022,
    "Kid": 1234567890123456,
    "Cat": 700,
    "Txt": "Baby Doe  is working on curriculum ",
    "Utm": 1050,
    "Id": 1466741737
  }, {
    "By": 9879879879879879,
    "Ptm": 1242,
    "e": "10/22/2014 11:33",
    "ms": 166473351097,
    "n": "Mashed potatoes, chicken gravy, steamed veggies, pears, milk",
    "lId": 145302146106,
    "isst": 1,
    "Pdt": 141022,
    "Kid": 1234567890123456,
    "Cat": 200,
    "Txt": "Baby Doe  ate Lunch",
    "Utm": 1133,
    "Id": 1472060549
  }, {
    "By": 9879879879879879,
    "Kid": 1234567890123456,
    "Ptm": 1243,
    "e": "10/22/2014 12:43",
    "Cat": 501,
    "Txt": "Baby Doe  starts sleeping",
    "ms": 166473418212,
    "lId": 145302215272,
    "Utm": 1243,
    "isst": 1,
    "Id": 1515291700,
    "Pdt": 141022
  }, {
    "By": 9879879879879879,
    "Ptm": 1412,
    "e": "10/22/2014 14:12",
    "ms": 166478753386,
    "lId": 145307545600,
    "isst": 1,
    "Pdt": 141022,
    "Photo": 1508541205,
    "Kid": 1234567890123456,
    "Cat": 1000,
    "Txt": "Photo",
    "Utm": 1412,
    "Id": 1508541205
  }, {
    "By": 9879879879879879,
    "Kid": 1234567890123456,
    "Ptm": 1431,
    "e": "10/22/2014 14:31",
    "Cat": 1100,
    "Txt": "Please bring more diapers by next Wednesday. ",
    "ms": 166479897971,
    "lId": 145308694731,
    "Utm": 1431,
    "isst": 1,
    "Id": 1466362335,
    "Pdt": 141022
  }, {
    "By": 9879879879879879,
    "Ptm": 1453,
    "d": 130,
    "e": "10/22/2014 14:53",
    "ms": 166481228455,
    "lId": 145310026415,
    "isst": 1,
    "Pdt": 141022,
    "Kid": 1234567890123456,
    "Cat": 502,
    "Txt": "Baby Doe  napped (2h10m)",
    "Utm": 1243,
    "Id": 1488191935
  }],
  "deleted": [],
  "all": true
}
```

**dc.getPhoto(photoId, callback)**
Return a binary buffer containing the specified photo. the `buffer.type` value will be set to the content-type of the image (for example: `image\jpeg`).



Example
----------
This example takes a username and password as arguments and returns the latest status for all children.
```javascript
var DailyConnect = require('dailyconnect')
var async = require('async')
var dateformat = require('dateformat')

var user = process.argv[2]
var pass = process.argv[3]

var mydc = new DailyConnect(user, pass)

async.waterfall([
  mydc.login.bind(mydc),
  mydc.getUserInfo.bind(mydc),
  gatherKidsLatestStatus
], completed)

function gatherKidsLatestStatus(userInfo, cb) {

  var latestKidEvents = []
  async.each(userInfo.myKids, getLatestEvent, function (err) {
    if (err) {
      return cb(err)
    }
    cb(null, latestKidEvents)
  })

  function getLatestEvent(kid, cb) {
    mydc.getKidStatus(kid.Id, function (err, kidStatus) {
      if (err) {
        return cb(err)
      }

      var status = 'no activity'
      var ts = ''
      if (kidStatus.list.length > 0) {
        var entry = kidStatus.list[kidStatus.list.length - 1]
        status = entry.Txt
        ts = entry.e
      }

      latestKidEvents.push(dateformat(ts, 'isoDateTime') + ': ' + kid.Name + ': ' + status)
      cb(null)
    })
  }
}

function completed(err, result) {
  if (err) {
    console.error(err)
  }
  console.log(result)
}

```

output:
```javascript
[ '2014-12-17T19:55:00: Some Baby: Some Baby napped (1h41m)',
  '2014-12-17T15:15:00: Other Baby: Other Baby ate a snack' ]

```
