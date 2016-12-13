var request = require('superagent')
var makeRetrieval = require('./index.js')

module.exports = function(urlRoot) {
	if (typeof urlRoot !== 'string') {
		throw new Error('Expected `urlRoot` to be a string')
	}

	return makeRetrieval({
		urlRoot: urlRoot,
		httpGet: function (fullUrl, cb) {
			request.get(fullUrl).end(cb)
		}
	})
}
