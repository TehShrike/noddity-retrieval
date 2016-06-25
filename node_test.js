var url = require('url')
var send = require('send')
var http = require('http')
var fs = require('fs')
var tape = require('tape')

var server = http.createServer(function(req, res) {
	send(req, url.parse(req.url).pathname, { root: __dirname + '/test/content/' })
		.pipe(res)
})
server.listen(8989)

fs.readdirSync('./test')
	.filter(function(path) {
		return /^test_/.test(path)
	}).forEach(function(path) {
		console.log('running', path)
		require('./test/' + path)
	})

var tapeResults = tape.getHarness()._results

tapeResults.on('done', function() {
	console.log('# tests ' + tapeResults.count)
	tapeResults.pass > 0 && console.log('# pass  ' + tapeResults.pass)
	tapeResults.fail > 0 && console.log('# fail  ' + tapeResults.fail)

	server.close()
	var passed = tapeResults.fail === 0
	process.exit(passed ? 0 : 1)
})