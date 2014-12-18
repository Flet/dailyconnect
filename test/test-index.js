require('mocha')

var chai = require('chai'),
  nock = require('nock')

var assert = chai.assert

var email = 'fake@fakey.nope', //process.env.EMAIL,
  pass = 'secret', //process.env.PASS,
  kidid = '1234567890123456' //process.env.KIDID

var useNock = true
// nock.recorder.rec()
describe('dailyconnect API tests', function () {
  var Api = require('../')
  var api = new Api(email, pass)

  it('No error on successful login (302)', function (done) {
    if (useNock) {
      nock('https://www.dailyconnect.com:443')
        .post('/Cmd?cmd=UserAuth', 'email=fake%40fakey.nope&pass=secret')
        .reply(302, '', {
          expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
          'set-cookie': ['seacloud1=1/uid.123;Path=/'],
          location: 'https://www.dailyconnect.com/home',
          date: 'Fri, 24 Oct 2014 06:31:18 GMT',
          'content-type': 'text/html',
          server: 'Google Frontend',
          'content-length': '0'
        })
    }

    api.login(function (err) {
      if (err) {
        assert.fail(err, true)
      }
      done()
    })
  })

  it('getUserInfo returns user info', function (done) {
    if (useNock) {
      nock('https://www.dailyconnect.com:443')
        .post('/CmdW', 'cmd=UserInfoW')
        .reply(200, {
          'Name': 'John Doe',
          'Ut': 1,
          'Email': 'fake@fakey.nope',
          'created': '5/12/2014',
          'myKids': [{
            'Name': 'Baby Doe',
            'Created': 140512,
            'Contacts': [{
              'phone': '8005551212',
              'name': 'Some name-  home'
            }],
            'PhotoInd': 2,
            'Id': 1234567890123456,
            'Parents': [{
              'Name': 'John Doe',
              'Ut': 1,
              'Email': 'fake@fakey.nope',
              'Id': 6543210987654321
            }, {
              'Name': 'Jane Doe',
              'Ut': 1,
              'Email': 'alsofake@fakey.nope',
              'Id': 1231231231231231
            }, {
              'Name': 'Great Preschool Room 1',
              'Ut': 10,
              'Email': 'fakeschool@fakey.nope',
              'Id': 9879879879879879,
              'cc': [6767676767676767]
            }, {
              'Name': 'Great Preschool-SomeCity',
              'Type': 2,
              'ccId': 6767676767676767,
              'Id': 6767676767676767
            }],
            'Boy': true,
            'Allergies': '',
            'Photo': 5656565656565656,
            'BDay': '10/26/2011'
          }],
          'nws': true,
          'Id': 6543210987654321
        }, {
          expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
          'set-cookie': ['seacloud1=1/uid.123;Path=/'],
          'content-type': 'text/plain; charset=utf-8',
          vary: 'Accept-Encoding',
          date: 'Fri, 24 Oct 2014 06:31:18 GMT',
          server: 'Google Frontend',
          'cache-control': 'private',
          'transfer-encoding': 'chunked'
        })
    }

    api.getUserInfo(function (err, user) {
      if (err) {
        assert.fail(err, true)
        done()
      }
      assert.isObject(user, 'user is not an object')
      assert.equal(user.Email, api.email)
      done()
    })
  })

  it('getKidSummaryByDay returns kid summary', function (done) {

    if (useNock) {
      nock('https://www.dailyconnect.com:443')
        .post('/CmdW', 'cmd=KidGetSummary&Kid=1234567890123456&pdt=141022')
        .reply(200, {
          'summary': {
            'totalSleepDuration': 130,
            'timeOfLastSleeping': '10/22/2014 14:53',
            'kidId': 1234567890123456,
            'timeOfLastFood': '10/22/2014 11:33',
            'nrOfSleep': 1,
            'longuestSleepDuration': 130,
            'day': 141022,
            'timeOfLastDropOff': '10/22/2014 7:45',
            'isSleeping': false
          }
        }, {
          expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
          'set-cookie': ['seacloud1=1/uid.123;Path=/'],
          'content-type': 'text/plain; charset=utf-8',
          vary: 'Accept-Encoding',
          date: 'Fri, 24 Oct 2014 07:00:40 GMT',
          server: 'Google Frontend',
          'cache-control': 'private',
          'transfer-encoding': 'chunked'
        })
    }

    api.getKidSummaryByDay(kidid, new Date(2014, 9, 22), function (err, kidinfo) {
      if (err) {
        assert.fail(err, true)
        done()
      }
      assert.isObject(kidinfo, 'kidinfo is not an object')
      assert.equal(kidid, kidinfo.summary.kidId)
      done()
    })
  })

  it('getKidStatusByDay returns kid daily status', function (done) {

    if (useNock) {
      nock('https://www.dailyconnect.com:443')
        .post('/CmdListW', 'cmd=StatusList&Kid=1234567890123456&pdt=141022&fmt=long')
        .reply(200, {
          'summary': {
            'totalSleepDuration': 130,
            'timeOfLastSleeping': '10/22/2014 14:53',
            'kidId': 1234567890123456,
            'timeOfLastFood': '10/22/2014 11:33',
            'nrOfSleep': 1,
            'longuestSleepDuration': 130,
            'day': 141022,
            'timeOfLastDropOff': '10/22/2014 7:45',
            'isSleeping': false
          },
          'staff': [],
          'users': [{
            'Name': 'Great Preschool Room 1',
            'Ut': 10,
            'Email': 'fakepreschoo@fakey.nope',
            'Id': 9879879879879879,
            'cc': [6767676767676767]
          }],
          'ts': 166481228455,
          'kidId': 1234567890123456,
          'pdt': 141022,
          'list': [{
            'By': 9879879879879879,
            'Kid': 1234567890123456,
            'Ptm': 1010,
            'e': '10/22/2014 09:45',
            'Cat': 101,
            'Txt': 'Baby Doe  is dropped off',
            'ms': 166464259139,
            'lId': 145293057051,
            'Utm': 945,
            'isst': 1,
            'Id': 1509600413,
            'Pdt': 141022
          }, {
            'By': 9879879879879879,
            'Kid': 1234567890123456,
            'Ptm': 1010,
            'e': '10/22/2014 10:01',
            'Cat': 700,
            'Txt': 'Baby Doe  is on the playground ',
            'ms': 166464248036,
            'lId': 145293043669,
            'Utm': 1001,
            'isst': 1,
            'Id': 1496860453,
            'Pdt': 141022
          }, {
            'By': 9879879879879879,
            'Ptm': 1253,
            'e': '10/22/2014 10:50',
            'ms': 166474032684,
            'n': 'Apple bobbing- the kids used tongs to bob for apples. This activity worked on hand-eye coordination and fine motor skills.',
            'lId': 145302826419,
            'isst': 1,
            'Pdt': 141022,
            'Kid': 1234567890123456,
            'Cat': 700,
            'Txt': 'Baby Doe  is working on curriculum ',
            'Utm': 1050,
            'Id': 1466741737
          }, {
            'By': 9879879879879879,
            'Ptm': 1242,
            'e': '10/22/2014 11:33',
            'ms': 166473351097,
            'n': 'Mashed potatoes, chicken gravy, steamed veggies, pears, milk',
            'lId': 145302146106,
            'isst': 1,
            'Pdt': 141022,
            'Kid': 1234567890123456,
            'Cat': 200,
            'Txt': 'Baby Doe  ate Lunch',
            'Utm': 1133,
            'Id': 1472060549
          }, {
            'By': 9879879879879879,
            'Kid': 1234567890123456,
            'Ptm': 1243,
            'e': '10/22/2014 12:43',
            'Cat': 501,
            'Txt': 'Baby Doe  starts sleeping',
            'ms': 166473418212,
            'lId': 145302215272,
            'Utm': 1243,
            'isst': 1,
            'Id': 1515291700,
            'Pdt': 141022
          }, {
            'By': 9879879879879879,
            'Ptm': 1412,
            'e': '10/22/2014 14:12',
            'ms': 166478753386,
            'lId': 145307545600,
            'isst': 1,
            'Pdt': 141022,
            'Photo': 1508541205,
            'Kid': 1234567890123456,
            'Cat': 1000,
            'Txt': 'Photo',
            'Utm': 1412,
            'Id': 1508541205
          }, {
            'By': 9879879879879879,
            'Kid': 1234567890123456,
            'Ptm': 1431,
            'e': '10/22/2014 14:31',
            'Cat': 1100,
            'Txt': 'Please bring more diapers by next Wednesday. ',
            'ms': 166479897971,
            'lId': 145308694731,
            'Utm': 1431,
            'isst': 1,
            'Id': 1466362335,
            'Pdt': 141022
          }, {
            'By': 9879879879879879,
            'Ptm': 1453,
            'd': 130,
            'e': '10/22/2014 14:53',
            'ms': 166481228455,
            'lId': 145310026415,
            'isst': 1,
            'Pdt': 141022,
            'Kid': 1234567890123456,
            'Cat': 502,
            'Txt': 'Baby Doe  napped (2h10m)',
            'Utm': 1243,
            'Id': 1488191935
          }],
          'deleted': [],
          'all': true
        }, {
          expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
          'set-cookie': ['seacloud1=1/uid.123;Path=/'],
          'content-type': 'text/plain; charset=utf-8',
          vary: 'Accept-Encoding',
          date: 'Fri, 24 Oct 2014 07:00:41 GMT',
          server: 'Google Frontend',
          'cache-control': 'private',
          'transfer-encoding': 'chunked'
        })
    }

    api.getKidStatusByDay(kidid, new Date(2014, 9, 22), function (err, status) {
      if (err) {
        assert.fail(err, true)
        done()
      }
      assert.isObject(status, 'status is not an object')
      assert.equal(kidid, status.kidId)
      assert.equal(true, status.all)
      done()
    })
  })

  it('getPhoto returns buffer with type property', function (done) {

    if (useNock) {
      nock('https://www.dailyconnect.com:443')
        .get('/GetCmd?cmd=PhotoGet&id=12345&thumb=0')
        .reply(200, '89504e470d0a1a0a0000000trucated-for-sanity', {
          'content-type': 'image/jpg',
          'content-disposition': 'inline; filename=\"Photo.jpg\"',
          date: 'Fri, 24 Oct 2014 07:17:59 GMT',
          server: 'Google Frontend',
          'content-length': '4415'
        })

    }
    api.getPhoto(12345, function (err, photo) {
      if (err) {
        console.log(err)
        assert.fail(err, true)
        done()
      }
      assert.equal(photo.type, 'image/jpg')
      done()
    })
  })

})
