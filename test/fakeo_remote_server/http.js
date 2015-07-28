var url = require('url')
var send = require('send')
var http = require('http')

module.exports = function(port, dir) {
	var server = http.createServer(function(req, res) {
		send(req, url.parse(req.url).pathname, { root: __dirname + ( dir || '/content') })
			.pipe(res)
	})

	server.listen(port)

	return server
}
