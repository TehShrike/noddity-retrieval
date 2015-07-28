var url = require('url')
var send = require('send')
var selfSignedHttps = require('self-signed-https')

module.exports = function(port) {
	var server = selfSignedHttps(function(req, res) {
		send(req, url.parse(req.url).pathname, { root: __dirname + '/content' })
			.pipe(res)
	})

	server.listen(port)

	return server
}
