var fs = require('fs')
var run = require('tape-run')
var browserify = require('browserify')

var testFiles = fs.readdirSync(__dirname)
	.filter(function(path) {
		return /^test_(common|browser).+\.js$/.test(path)
	}).map(function (path) {
		return __dirname + '/' + path
	})

browserify(testFiles)
	.bundle()
	.pipe(run({ static: __dirname + '/content/' }))
	.on('results', function (results) {
		if (!results.ok) process.exit(1)
	})
	.pipe(process.stdout)
