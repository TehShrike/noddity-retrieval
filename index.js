var request = require('superagent')
var url = require('url')
var parser = require('text-metadata-parser')

module.exports = function NoddityRetrieval(root) {
	function lookup(file, property, cb) {
		if (typeof file !== 'string') {
			process.nextTick(function () {
				cb(new TypeError('Parameter \'file\' must be a string, not ' + typeof file))
			})
		} else {
			var fullUrl = url.resolve(root, file)
			request.get(fullUrl).end(function (err, res) {
				if (err) {
					cb(new Error("Lookup of " + fullUrl + " failed\n========\n" + err.message))
				} else if (res.status !== 200) {
					cb(new Error("Lookup of " + fullUrl + " returned status " + res.status + "\n==========\n" + res.text))
				} else {
					cb(null, res[property])
				}
			})
		}
	}

	return {
		getIndex: function(cb) {
			lookup('index.json', 'body', cb)
		},
		getPost: function(filename, cb) {
			lookup(filename, 'text', function (err, textToParse) {
				if (err) {
					cb(err)
				} else {
					var post = parser(textToParse, {
						date: 'date',
						boolean: 'markdown'
					})
					post.filename = filename
					cb(null, post)
				}
			})
		}
	}
}
