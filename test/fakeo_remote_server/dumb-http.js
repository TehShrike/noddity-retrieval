var url = require('url')
var fs = require('fs')
var http = require('http')

module.exports = function(port, dir) {
	var server = http.createServer(function(req, res) {
		var file = __dirname + ( dir || '/content') + url.parse(req.url).pathname
		var stream = fs.createReadStream(file)
		stream.pipe(res)
		stream.on('error', function () {
			res.writeHead(404)
			res.end('404')
		})
	})

	server.listen(port)

	return server
}
