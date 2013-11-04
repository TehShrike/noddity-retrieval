var http = require('http')
var url = require('url')
var concat = require('concat-stream')
var parser = require('text-metadata-parser')

module.exports = function NoddityRetrieval(root) {
	var lookup = function(file, cb, parse) {
		var data = ''
		http.get(url.resolve(root, file), function(res) {
			res.setEncoding('utf8')
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
					var posts = null
					try {
						posts = parse(data)
					} catch (e) {
						cb(new Error("Error parsing file with contents:\n" + data + "\n==========\n" + e.message))
					}

					if (posts !== null) {
						cb(false, posts)						
					}
				}
			})
		})
	}

	return {
		getIndex: function(cb) {
			lookup('index.json', cb, JSON.parse)
		},
		getPost: function(post, cb) {
			lookup(post, cb, function(textToParse) {
				return parser(textToParse, {
					date: 'date'
				})
			});
		}
	}
}
