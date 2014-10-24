var request = require('request'),
  dateformat = require('dateformat'),
  qs = require('querystring')

var log
if (process.env.DC_ENV === 'test') {
  log = function logger(obj) {
    console.log(obj)
  }
} else {
  log = function noop() {}
}

var logRequest = function (req) {
  log('~~~REQUEST~~~')
  log(req)
}

var logResponse = function (err, resp, body) {
  log('~~~RESPONSE~~~')
  log({
    err: err,
    headers: resp ? resp.headers : null,
    statusCode: resp ? resp.statusCode : null,
    body: body
  })
  log('~~~')
}

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

  logRequest(req)

  request(req, function (err, response, body) {
    logResponse(err, response, body)
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 302) {
      return cb(null, true)
    }
    var loginerr = new Error('Error on login' + response.statusCode)
    return cb(loginerr)
  })
}

Api.prototype.userInfo = function (cb) {
  var req = {
    jar: this.jar,
    form: {
      cmd: 'UserInfoW'
    },
    method: 'POST',
    url: 'https://www.dailyconnect.com/CmdW'
  }

  logRequest(req)

  request(req, function (err, response, body) {
    logResponse(err, response, body)
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

Api.prototype.kidSummary = function (kidId, inDate, cb) {

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

  logRequest(req)

  request(req, function (err, response, body) {
    logResponse(err, response, body)
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 200) {
      return cb(null, JSON.parse(body))
    }
    return cb(new Error('Error while retrieving user info: ' + response.statusCode))
  })
}

Api.prototype.kidStatus = function (kidId, inDate, cb) {
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

  logRequest(req)

  request(req, function (err, response, body) {
    logResponse(err, response, body)
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

  logRequest(req)

  request(req, function (err, response, body) {
    logResponse(err, response, body)
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
