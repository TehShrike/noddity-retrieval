var url = require('url')
var send = require('send')
var http = require('http')
var fs = require('fs')
var tape = require('tape')

var server = http.createServer(function(req, res) {
	send(req, url.parse(req.url).pathname, { root: __dirname + '/content/' })
		.pipe(res)
})
server.listen(8989)

var testFiles = fs.readdirSync(__dirname)
	.filter(function(path) {
		return /^test_(common|node).+\.js$/.test(path)
	}).forEach(function(path) {
		return './' + path
	})

testFiles.forEach(require)

var tapeResults = tape.getHarness()._results

tapeResults.on('done', function() {
	console.log('# tests ' + tapeResults.count)
	tapeResults.pass > 0 && console.log('# pass  ' + tapeResults.pass)
	tapeResults.fail > 0 && console.log('# fail  ' + tapeResults.fail)

	server.close()
	var passed = tapeResults.fail === 0
	process.exit(passed ? 0 : 1)
})
