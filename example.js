var DailyConnect = require('./index.js')
var async = require('async')
var dateformat = require('dateformat')

var user = process.argv[2]
var pass = process.argv[3]

var mydc = new DailyConnect(user, pass)

function gatherKidsLatestStatus (userInfo, cb) {
  var latestKidEvents = []
  async.each(userInfo.myKids, getLatestEvent, function (err) {
    if (err) {
      return cb(err)
    }
    cb(null, latestKidEvents)
  })

  function getLatestEvent (kid, cb) {
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

function completed (err, result) {
  if (err) {
    console.error(err)
  }
  console.log(result)
}

async.waterfall([
  mydc.login.bind(mydc),
  mydc.getUserInfo.bind(mydc),
  gatherKidsLatestStatus
], completed)
