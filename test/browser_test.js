var url = require('url')
var send = require('send')
var http = require('http')
var fs = require('fs')
var run = require('tape-run')
var browserify = require('browserify')

var server = http.createServer(function(req, res) {
	send(req, url.parse(req.url).pathname, { root: __dirname + '/content/' })
		.pipe(res)
})
server.listen(require('./get_port')())//i dont think this will work

var testFiles = fs.readdirSync(__dirname)
	.filter(function(path) {
		return /^test_(common|browser).+\.js$/.test(path)
	}).map(function (path) {
		return __dirname + '/' + path
	})

server.once('listening', function () {
	browserify(testFiles)
		.bundle()
		.pipe(run()) // this is not serving static files!!!!!!!!
		.on('results', function (results) {
			server.close()
			if (!results.ok) process.exit(1)
		})
		.pipe(process.stdout)
})