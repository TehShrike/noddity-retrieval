var test = require('tap').test
var fakeoServer = require('./fakeo_remote_server/index.js')
var Retrieve = require('../')

test('retrieve a post by filename', function(t) {
	var server = fakeoServer(8989)

	var retrieve = new Retrieve('http://127.0.0.1:8989')

	retrieve.getPost('post1.md', function(err, post) {
		t.notOk(err, "no error retrieving post1.md")
		t.equal(post.metadata.title, 'This is the first post', 'first title is correct')
		t.equal(post.filename, 'post1.md', 'first filename is correct')
		server.close()
		t.end()
	})
})

test('retrieve a non-existant post', function(t) {
	var server = fakeoServer(8989)

	var retrieve = new Retrieve('http://127.0.0.1:8989')

	retrieve.getPost('nothing.lol', function(err, post) {
		t.ok(err, "error retrieving nothing.lol")
		server.close()
		t.end()
	})
})

test('retrieve from a non-existant server', function(t) {
	var retrieve = new Retrieve('http://127.0.0.1:8989')

	retrieve.getPost('nothing.lol', function(err, post) {
		t.ok(err, "error retrieving nothing.lol")
		t.end()
	})
})
