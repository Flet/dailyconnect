var request = require('request')
var dateformat = require('dateformat')
var qs = require('querystring')
var logger = require('./logger.js')

var Api = function (email, pass) {
  this.email = email
  this.pass = pass
  this.jar = request.jar()
}

Api.prototype.login = function (cb) {
  var req = {
    jar: this.jar,
    form: {
      email: this.email,
      pass: this.pass
    },
    method: 'POST',
    url: 'https://www.dailyconnect.com/Cmd?cmd=UserAuth'
  }

  logger.logReq(req)

  request(req, function (err, response, body) {
    logger.logResp(err, response, body)
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 302) {
      return cb(null)
    }
    var loginerr = new Error('Error on login' + response.statusCode)
    return cb(loginerr)
  })
}

Api.prototype.getUserInfo = function (cb) {
  var req = {
    jar: this.jar,
    form: {
      cmd: 'UserInfoW'
    },
    method: 'POST',
    url: 'https://www.dailyconnect.com/CmdW'
  }

  logger.logReq(req)

  request(req, function (err, response, body) {
    logger.logResp(err, response, body)
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 200) {
      return cb(null, JSON.parse(body))
    }
    var userInfoErr = new Error('Error while retrieving user info: ' + response.statusCode)
    return cb(userInfoErr)
  })
}

Api.prototype.getKidSummary = function (kidId, cb) {
  this.getKidSummaryByDay(kidId, new Date(), cb)
}

Api.prototype.getKidSummaryByDay = function (kidId, inDate, cb) {
  var req = {
    jar: this.jar,
    form: {
      cmd: 'KidGetSummary',
      Kid: kidId,
      pdt: dateformat(inDate, 'yymmdd')
    },
    method: 'POST',
    url: 'https://www.dailyconnect.com/CmdW'
  }

  logger.logReq(req)

  request(req, function (err, response, body) {
    logger.logResp(err, response, body)
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 200) {
      return cb(null, JSON.parse(body))
    }
    return cb(new Error('Error while retrieving user info: ' + response.statusCode))
  })
}

Api.prototype.getKidStatus = function (kidId, cb) {
  this.getKidStatusByDay(kidId, new Date(), cb)
}

Api.prototype.getKidStatusByDay = function (kidId, inDate, cb) {
  // TODO: possibly add optional 'fmt' arg instead of defauting to 'long'
  var req = {
    jar: this.jar,
    form: {
      cmd: 'StatusList',
      Kid: kidId,
      pdt: dateformat(inDate, 'yymmdd'),
      fmt: 'long'
    },
    method: 'POST',
    url: 'https://www.dailyconnect.com/CmdListW'
  }

  logger.logReq(req)

  request(req, function (err, response, body) {
    logger.logResp(err, response, body)
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 200) {
      return cb(null, JSON.parse(body))
    }
    return cb(new Error('Error while retrieving user info: ' + response.statusCode))
  })
}

Api.prototype.getPhoto = function (photoId, cb) {
  var req = {
    encoding: null,
    jar: this.jar,
    method: 'GET',
    url: 'https://www.dailyconnect.com/GetCmd?' + qs.stringify({
      cmd: 'PhotoGet',
      id: photoId,
      thumb: 0
    })
  }

  logger.logReq(req)

  request(req, function (err, response, body) {
    logger.logResp(err, response, body)
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 200) {
      var buf = new Buffer(body, 'binary')
      buf.type = response.headers['content-type']
      return cb(null, buf)
    }
    return cb(new Error('Error while retrieving photo: ' + response.statusCode + ' ' + JSON.stringify(response)))
  })
}

module.exports = Api
