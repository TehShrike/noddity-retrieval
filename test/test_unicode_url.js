var test = require('tape')
var Retrieve = require('../')

var fakeoServer = require('./fakeo_remote_server/http.js')


test('URL-encoded unicode characters in URL', function(t) {
	var server = fakeoServer(2000)
	var retrieve = new Retrieve('http://127.0.0.1:2000')

	retrieve.getPost('unicode%e2%80%93dash.md', function(err, post) {
		t.ifError(err)

		t.equal(post.metadata.title, 'unicode dash in filename')
		t.equal(post.content.slice(0, 25), 'unicode is pretty awesome')

		server.close()
		t.end()
	})
})


test('Non-URL-encoded unicode characters in URL', function(t) {
	var server = fakeoServer(2001)
	var retrieve = new Retrieve('http://127.0.0.1:2001')

	retrieve.getPost('unicode–dash.md', function(err, post) {
		t.ifError(err)

		t.equal(post.metadata.title, 'unicode dash in filename')
		t.equal(post.content.slice(0, 25), 'unicode is pretty awesome')

		server.close()
		t.end()
	})
})
