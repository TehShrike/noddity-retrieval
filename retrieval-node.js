var httpBasic = require('http-basic')
var concat = require('simple-concat')
var makeRetrieval = require('./index.js')

module.exports = function (urlRoot) {
	if (typeof urlRoot !== 'string') {
		throw new Error('Expected `urlRoot` to be a string')
	}

	return makeRetrieval({
		urlRoot: urlRoot,
		httpGet: httpGet
	})
}

var httpBasicOptions = {
	cache: 'memory'
}

function httpGet(fullUrl, cb) {
	httpBasic('GET', fullUrl, httpBasicOptions, function (err, res) {
		if (err) return cb(err)
		concat(res.body, function (err, buf) {
			if (err) return cb(err)
			res.text = buf.toString()
			res.status = res.statusCode
			if (res.status === 304) res.status = 200
			cb(null, res)
		})
	})
}
