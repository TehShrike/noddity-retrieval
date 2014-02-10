var http = require('http')
var url = require('url')
var concat = require('concat-stream')
var parser = require('text-metadata-parser')

module.exports = function NoddityRetrieval(root) {
	var lookup = function(file, cb, parse) {
		var data = ''
		var fullPath = url.resolve(root, file)
		http.get(url.parse(fullPath), function(res) {
			res.setEncoding && res.setEncoding('utf8')
			res.on('data', function(chunk) {
				if (data !== null) {
					data += chunk
				}
			})
			res.on('error', function(err) {
				data = null
				cb(err)
			})
			res.on('end', function(chunk) {
				if (data !== null) {
					if (typeof chunk !== 'undefined') {
						data += chunk
					}

					if (res.statusCode !== 200) {
						cb(new Error("Lookup of " + fullPath + " returned status " + res.statusCode + "\n========\n" + data))
					} else {
						var information = null
						try {
							information = parse(data)
						} catch (e) {
							cb(new Error("Error parsing file with contents:\n" + data + "\n==========\n" + e.message))
						}

						if (information !== null) {
							cb(false, information)
						}
					}
				}
			})
		}).on('error', function(err) {
			cb(new Error("Lookup of " + fullPath + " failed\n========\n" + err.message))
		})
	}

	return {
		getIndex: function(cb) {
			lookup('index.json', cb, JSON.parse)
		},
		getPost: function(filename, cb) {
			lookup(filename, cb, function(textToParse) {
				var post = parser(textToParse, {
					date: 'date'
				})
				post.filename = filename
				return post
			});
		}
	}
}
