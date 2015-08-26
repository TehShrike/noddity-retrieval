var url = require('url')
var send = require('send')
var selfSignedHttps = require('self-signed-https')

module.exports = function(port, dir) {
	var server = selfSignedHttps(function(req, res) {
		send(req, url.parse(req.url).pathname, { root: __dirname + ( dir || '/content') })
			.pipe(res)
	})

	server.listen(port)

	return server
}
