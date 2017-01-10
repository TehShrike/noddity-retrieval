var test = require('tape')
var Retrieve = require('../')
var port = require('./get_port')()
var protocol = 'http'

test('retrieve a post by filename', function(t) {
	var retrieve = new Retrieve(protocol + '://localhost:' + port)

	retrieve.getPost('/with-directories/folder1/folder-file-1.md', function(err, post) {
		t.notOk(err)
		t.equal(post.content, 'one')
		t.end()
	})
})

test('retrieve a post by filename', function(t) {
	var retrieve = new Retrieve(protocol + '://localhost:' + port)

	retrieve.getPost('/with-directories/folder1/folder2/folder-file-2.md', function(err, post) {
		t.notOk(err)
		t.equal(post.content, 'two')
		t.end()
	})
})
