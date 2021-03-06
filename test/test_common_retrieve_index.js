var test = require('tape')
var Retrieve = require('../')
var port = require('./get_port')()
var protocol = 'http'

test('retrieve the index and the posts it references using ' + protocol, function(t) {
	var retrieve = new Retrieve(protocol + '://localhost:' + port)

	t.plan(5)

	retrieve.getIndex(function(err, index) {
		t.equal(index.length, 2, 'index.json has 2 entries')

		retrieve.getPost(index[0], function(err, post) {
			t.equal(post.metadata.title, 'This is the first post', 'first title is correct')
			t.equal(post.content, 'Howdy, and thanks for reading this post!', 'first body is correct')

			retrieve.getPost(index[1], function(err, post) {
				t.equal(post.metadata.title, 'This is ANOTHER post', 'second title is correct')
				t.equal(post.content, 'Two posts, whaaat?', 'second body is correct')

				t.end()
			})
		})

	})
})

test('missing an index.json file', function(t) {
	var retrieve = new Retrieve(protocol + '://localhost:' + port + '/with-directories/folder1/')

	t.plan(2)

	retrieve.getIndex(function(err, index) {
		t.ok(err, 'Error when getting non-existant index')
		t.equal(index, undefined, 'index defaults to undefined')

		t.end()
	})
})

test('an invalid index.json file', function(t) {
	var retrieve = new Retrieve(protocol + '://localhost:' + port + '/bad-index-json/')

	t.plan(2)

	retrieve.getIndex(function(err, index) {
		t.ok(err, 'Error when getting invalid index.json')
		t.equal(index, undefined, 'index defaults to undefined')

		t.end()
	})
})
