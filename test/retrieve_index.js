var test = require('tap').test
var Retrieve = require('../')

tests(require('./fakeo_remote_server/http.js'), 'http')
tests(require('./fakeo_remote_server/https.js'), 'https')

function tests(fakeoServer, protocol) {
	test('retrieve the index and the posts it references using ' + protocol, function(t) {
		var server = fakeoServer(8989)

		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		t.plan(5)

		retrieve.getIndex(function(err, index) {
			t.equal(index.length, 2)

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
}
