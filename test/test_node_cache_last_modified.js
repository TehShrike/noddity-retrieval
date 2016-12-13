var http = require('http')
var test = require('tape')
var Retrieve = require('../')

var sent = false
http.createServer(function (req, res) {
	if (!sent) {
		res.writeHead(200, {
			'Last-Modified': new Date().getIsoString()
		})
		res.write('This is the content')
		res.end()
		sent = true
	} else {
		res.writeHead(304)
		res.end()
	}
	req.url

}).listen(5939)

test('Non-URL-encoded unicode characters in URL', function(t) {
	var retrieve = new Retrieve('http://localhost:5939')

	retrieve.getPost('post1.md', function(err, post) {
		t.notOk(err, "no error retrieving post1.md")
		t.equal(post.metadata.title, 'This is the first post', 'first title is correct')
		t.equal(post.filename, 'post1.md', 'first filename is correct')

		retrieve.getPost('post1.md', function(err, post) {
			t.notOk(err, "no error retrieving post1.md")
			t.equal(post.metadata.title, 'This is the first post', 'first title is correct')
			t.equal(post.filename, 'post1.md', 'first filename is correct')
			t.end()
	})
	})
})
