var request = require('request')
var url = require('url')
var parser = require('text-metadata-parser')

module.exports = function NoddityRetrieval(root) {
	var lookup = function(file, cb, parse) {
		var fullPath = url.resolve(root, file)
		var options = {
			url: fullPath,
			agentOptions: { rejectUnauthorized: false } // Allow self-signed certs
		}
		request(options, function (err, res, body) {
			if (err) {
				cb(new Error("Lookup of " + fullPath + " failed\n========\n" + err.message))
			} else if (res.statusCode !== 200) {
				cb(new Error("Lookup of " + fullPath + " returned status " + res.statusCode + "\n==========\n" + body))
			} else {
				var information = null
				try {
					information = parse(body)
				} catch (e) {
					cb(new Error("Error parsing file with contents:\n" + body + "\n==========\n" + e.message))
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
