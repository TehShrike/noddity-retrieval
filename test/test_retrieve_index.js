var test = require('tape')
var Retrieve = require('../')

tests(require('./fakeo_remote_server/http.js'), 'http')
tests(require('./fakeo_remote_server/dumb-http.js'), 'http')
tests(require('./fakeo_remote_server/https.js'), 'https')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function tests(fakeoServer, protocol) {
	test('retrieve the index and the posts it references using ' + protocol, function(t) {
		var server = fakeoServer(8989)

		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		t.plan(5)

		retrieve.getIndex(function(err, index) {
			t.equal(index.length, 2, 'index.json has 2 entries')

			retrieve.getPost(index[0], function(err, post) {
				t.equal(post.metadata.title, 'This is the first post', 'first title is correct')
				t.equal(post.content, 'Howdy, and thanks for reading this post!', 'first body is correct')

				retrieve.getPost(index[1], function(err, post) {
					t.equal(post.metadata.title, 'This is ANOTHER post', 'second title is correct')
					t.equal(post.content, 'Two posts, whaaat?', 'second body is correct')

					server.close()
					t.end()
				})
			})

		})
	})

	test('invalid index', function(t) {
		var server = fakeoServer(8989, '/content-with-directories/folder1')

		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		t.plan(2)

		retrieve.getIndex(function(err, index) {
			t.ok(err, 'Error when getting non-existant index')
			t.equal(index, undefined, 'index defaults to undefined')

			server.close()
			t.end()
		})
	})
}
