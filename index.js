var url = require('url')
var parser = require('text-metadata-parser')

module.exports = function NoddityRetrieval(opts) {
	if (!opts || typeof opts !== 'object' || typeof opts.urlRoot !== 'string' || typeof opts.httpGet !== 'function') {
		throw new Error('Expected an options object with properties `urlRoot` (string) and `httpGet` (function)')
	}

	function lookup(file, transform, cb) {
		if (typeof file !== 'string') {
			process.nextTick(function() {
				cb(new TypeError('Parameter \'file\' must be a string, not ' + typeof file))
			})
		} else {
			var encodedFile = file.split('/').map(function(part) {
				return encodeURIComponent(part)
			}).join('/')
			var fullUrl = url.resolve(opts.urlRoot, encodedFile)

			opts.httpGet(fullUrl, function(err, res) {
				if (err) {
					cb(new Error("Lookup of " + fullUrl + " failed\n========\n" + err.message))
				} else if (res.status !== 200) {
					cb(new Error("Lookup of " + fullUrl + " returned status " + res.status + "\n==========\n" + res.text))
				} else if (typeof res.text !== 'string') {
					cb(new Error("Lookup of " + fullUrl + " returned status " + res.status + " but non-string body text:\n" + res))
				} else {
					var result
					try {
						result = [ null, transform(res.text) ]
					} catch (e) {
						result = [ e ]
					}
					cb.apply(null, result)
				}
			})
		}
	}

	return {
		getIndex: function(cb) {
			lookup('index.json', JSON.parse, cb)
		},
		getPost: function(filename, cb) {
			lookup(filename, function(textToParse) {
				var post = parser(textToParse, {
					date: 'date',
					boolean: 'markdown',
				})
				post.filename = filename
				return post
			}, cb)
		},
	}
}
