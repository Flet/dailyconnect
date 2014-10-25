var log
if (process.env.DC_ENV === 'test') {
  log = function logger(obj) {
    console.log(obj)
  }
} else {
  log = function noop() {}
}

module.exports.logReq = function (req) {
  log('~~~')
  log(req)
}

module.exports.logResp = function (err, resp, body) {
  log('~~~')
  log({
    err: err,
    headers: resp ? resp.headers : null,
    statusCode: resp ? resp.statusCode : null,
    body: body
  })
  log('~~~')
}
