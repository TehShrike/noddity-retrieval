var test = require('tape')
var Retrieve = require('../')

if (process.browser) {
	tests(require('./fakeo_remote_server/browser-shim.js'), 'http')
} else {
	tests(require('./fakeo_remote_server/http.js'), 'http')
	tests(require('./fakeo_remote_server/https.js'), 'https')
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

function tests(fakeoServer, protocol) {
	test('retrieve a post by filename using ' + protocol, function(t) {
		var server = fakeoServer(8989)

		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		retrieve.getPost('post1.md', function(err, post) {
			t.notOk(err, "no error retrieving post1.md")
			if (!err) {
				t.equal(post.metadata.title, 'This is the first post', 'first title is correct')
				t.equal(post.filename, 'post1.md', 'first filename is correct')
			}
			server.close()
			t.end()
		})
	})

	test('retrieve a non-existant post using ' + protocol, function(t) {
		var server = fakeoServer(8989)

		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		retrieve.getPost('nothing.lol', function(err, post) {
			t.ok(err, "error retrieving nothing.lol")
			server.close()
			t.end()
		})
	})

	test('retrieve from a non-existant server using ' + protocol, function(t) {
		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		retrieve.getPost('nothing.lol', function(err, post) {
			t.ok(err, "error retrieving nothing.lol")
			t.end()
		})
	})

	test('Make sure the returned metadata is of the correct type using ' + protocol, function(t) {
		var server = fakeoServer(8989)
		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		retrieve.getPost('post1.md', function(err, post) {
			t.notOk(err, "no error retrieving post1.md")
			t.ok(post.metadata.date instanceof Date || !isNaN(post.metadata.date), "The date parameter is a date")
			t.equal(post.metadata.markdown, true, 'The "markdown" property is a boolean, and true')
			server.close()
			t.end()
		})
	})

	test('provide retrieve.getPost with a non-string post name using ' + protocol, function(t) {
		var server = fakeoServer(8989)

		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		retrieve.getPost(null, function(err, post) {
			t.ok(err, "error with non-string post name")
			server.close()
			t.end()
		})
	})

	test('retrieve a post with spaces in directory and file using ' + protocol, function(t) {
		var server = fakeoServer(8989)

		var retrieve = new Retrieve(protocol + '://127.0.0.1:8989')

		retrieve.getPost('directory with space/file with space.md', function(err, post) {
			t.error(err)
			t.equal(post.content.trim(), 'Dangerous!')
			server.close()
			t.end()
		})
	})

}
