var test = require('tape')
var Retrieve = require('../')

var fakeoServer = require('./fakeo_remote_server/http.js')

test('retrieve a post by filename', function(t) {
	var server = fakeoServer(8989, '/content-with-directories')

	var retrieve = new Retrieve('http://127.0.0.1:8989')

	retrieve.getPost('folder1/folder-file-1.md', function(err, post) {
		t.notOk(err)
		t.equal(post.content, 'one')
		server.close()
		t.end()
	})
})

test('retrieve a post by filename', function(t) {
	var server = fakeoServer(8989, '/content-with-directories')

	var retrieve = new Retrieve('http://127.0.0.1:8989')

	retrieve.getPost('folder1/folder2/folder-file-2.md', function(err, post) {
		t.notOk(err)
		t.equal(post.content, 'two')
		server.close()
		t.end()
	})
})

