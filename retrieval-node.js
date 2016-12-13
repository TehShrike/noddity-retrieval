global.fetch = require('node-fetch')
global.fetch.Promise = require('es6-promise')
var popsicle = require('popsicle')
var popsicleCache = require('popsicle-cache')
var catbox = require('catbox-memory')
var makeRetrieval = require('./index.js')

var cache = popsicleCache.plugin({
	engine: catbox,
	ttl: popsicleCache.ttls.forever()
})

module.exports = function (urlRoot) {
	if (typeof urlRoot !== 'string') {
		throw new Error('Expected `urlRoot` to be a string')
	}

	return makeRetrieval({
		urlRoot: urlRoot,
		httpGet: function (fullUrl, cb) {
			popsicle.get(fullUrl)
				.use(cache.handle)
				.then(function (res) {
					res.text = res.body
					cb(null, res)
				}, function (err) {
					cb(err)
				})
		}
	})
}
