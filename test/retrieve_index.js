var test = require('tap').test
var fakeoServer = require('./fakeo_remote_server/index.js')
var Retrieve = require('../')

test('retrieve the index and the posts it references', function(t) {
	var server = fakeoServer(8989)

	var retrieve = new Retrieve('http://127.0.0.1:8989')

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
