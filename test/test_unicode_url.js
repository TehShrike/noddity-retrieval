var test = require('tape')
var Retrieve = require('../')
var port = require('./get_port')()
var protocol = 'http'

test('Non-URL-encoded unicode characters in URL', function(t) {
	var retrieve = new Retrieve(protocol + '://localhost:' + port)

	retrieve.getPost('unicode–dash.md', function(err, post) {
		t.ifError(err)

		t.equal(post.metadata.title, 'unicode dash in filename')
		t.equal(post.content.slice(0, 25), 'unicode is pretty awesome')

		t.end()
	})
})
