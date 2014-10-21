require('mocha')

var chai = require('chai'),
  sinon = require('sinon'),
  request = require('request')

var assert = chai.assert

// testing for realz... will convert to mocks when complete
var email = process.env.EMAIL,
  pass = process.env.PASS,
  kidid = process.env.KIDID

chai.use(require('chai-interface'))

//sinon.stub(request, 'post').yields(null, res, res.body)

describe('daily connect api tests', function () {
  var Api = require('../')
  var api = new Api(email, pass)

  it('returns true on successful login (302)', function (done) {

    api.login(function (err, loggedOn) {
      if (err) {
        assert.fail(err, true)
      }
      assert(loggedOn, 'response not ok')
      done()
    })
  })

  it('returns user info', function (done) {

    api.userInfo(function (err, user) {
      if (err) {
        assert.fail(err, true)
        done()
      }
      assert.isObject(user, 'user is not an object')
      assert.equal(user.Email, api.email)
      done()
    })
  })

  it('returns kid summary', function (done) {

    api.kidSummary(kidid, new Date(), function (err, kidinfo) {
      if (err) {
        assert.fail(err, true)
        done()
      }
      assert.isObject(kidinfo, 'kidinfo is not an object')
      assert.equal(kidid, kidinfo.summary.kidId)
      done()
    })
  })

  it('returns kid summary', function (done) {

    api.kidSummary(kidid, new Date(), function (err, kidinfo) {
      if (err) {
        assert.fail(err, true)
        done()
      }
      assert.isObject(kidinfo, 'kidinfo is not an object')
      assert.equal(kidid, kidinfo.summary.kidId)
      done()
    })
  })


  it('returns kid status', function (done) {

    api.kidStatus(kidid, new Date(), function (err, status) {
      if (err) {
        assert.fail(err, true)
        done()
      }
      assert.isObject(status, 'status is not an object')
      console.log(status)
      assert.equal(kidid, status.kidId)
      assert.equal(true, status.all)
      done()
    })
  })


})
