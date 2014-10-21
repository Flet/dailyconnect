var request = require('request'),
  dateformat = require('dateformat')

var Api = function (email, pass) {
  this.email = email
  this.pass = pass
  this.jar = request.jar()
}

Api.prototype.login = function (cb) {
  request.post({
    jar: this.jar,
    form: {
      email: this.email,
      pass: this.pass
    },
    url: 'https://www.dailyconnect.com/Cmd?cmd=UserAuth'
  }, function (err, response) {
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 302) {
      return cb(null, true)
    }
    return cb(new Error('Error on login' + response.statusCode))
  })
}

Api.prototype.userInfo = function (cb) {
  request.post({
    jar: this.jar,
    form: {
      cmd: 'UserInfoW'
    },
    url: 'https://www.dailyconnect.com/CmdW'
  }, function (err, response, body) {
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 200) {
      return cb(null, JSON.parse(body))
    }
    return cb(new Error('Error while retrieving user info: ' + response.statusCode))
  })
}

Api.prototype.kidSummary = function (kidId, inDate, cb) {
  request.post({
    jar: this.jar,
    form: {
      cmd: 'KidGetSummary',
      Kid: kidId,
      pdt: dateformat(inDate, 'yymmdd')
    },
    url: 'https://www.dailyconnect.com/CmdW'
  }, function (err, response, body) {
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
  request.post({
    jar: this.jar,
    form: {
      cmd: 'StatusList',
      Kid: kidId,
      pdt: dateformat(inDate, 'yymmdd'),
      fmt: 'long'
    },
    url: 'https://www.dailyconnect.com/CmdListW'
  }, function (err, response, body) {
    if (err) {
      return cb(err)
    }
    if (response.statusCode === 200) {
      return cb(null, JSON.parse(body))
    }
    return cb(new Error('Error while retrieving user info: ' + response.statusCode))
  })
}

module.exports = Api
