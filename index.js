var get = require('simple-get')
var url = require('url')
var parser = require('text-metadata-parser')

module.exports = function NoddityRetrieval(root) {
	var lookup = function(file, cb, parse) {
		var fullUrl = url.resolve(root, file)
		get.concat(fullUrl, function (err, body, res) {
			if (err) {
				cb(new Error("Lookup of " + fullUrl + " failed\n========\n" + err.message))
			} else if (res.statusCode !== 200) {
				cb(new Error("Lookup of " + fullUrl + " returned status " + res.statusCode + "\n==========\n" + body.toString()))
			} else {
				var information = null
				try {
					information = parse(body.toString())
				} catch (e) {
					cb(new Error("Error parsing file with contents:\n" + body.toString() + "\n==========\n" + e.message))
				}

				if (information !== null) {
					cb(null, information)
				}
			}
		})
	}

	return {
		getIndex: function(cb) {
			lookup('index.json', cb, JSON.parse)
		},
		getPost: function(filename, cb) {
			lookup(filename, cb, function(textToParse) {
				var post = parser(textToParse, {
					date: 'date',
					boolean: 'markdown'
				})
				post.filename = filename
				return post
			});
		}
	}
}
