var url = require('url')
var send = require('send')
var fs = require('fs')

module.exports = function(port) {
	var sslOptions = {
		key: fs.readFileSync(__dirname + '/cert/key.pem'),
		cert: fs.readFileSync(__dirname + '/cert/cert.pem'),
		requestCert: false,
		rejectUnauthorized: false
	}

	var server = require('https').createServer(sslOptions, function(req, res) {
		send(req, url.parse(req.url).pathname, { root: __dirname })
			.pipe(res)
	})

	server.listen(port)

	return server
}

// https://nodejs.org/api/https.html
// https://nodejs.org/api/crypto.html
