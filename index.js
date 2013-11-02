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
					cb(false, parse(data))
				}
			})
		})
	}

	return {
		getIndex: function(cb) {
			lookup('index.json', cb, JSON.parse)
		},
		getPost: function(post, cb) {
			lookup(post, cb, parser);
		}
	}
}
