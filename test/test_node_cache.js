var http = require('http')
var test = require('tape')
var Retrieve = require('../')


test('Caches based on etag header', function(t) {
	var etag = 'abcdefghijklmnopqrstuvwxyz123456'
	var first = true

	var server = http.createServer(function (req, res) {
		if (first) {
			res.writeHead(200, { 'ETag': etag })
			res.write('date: 2016-12-15\ntitle: cool beans\n\nThis is the content\n')
		} else {
			t.equal(req.headers['if-none-match'], etag, 'Expected etag')
			res.writeHead(304)
		}
		first = false
		res.end()
	})

	server.listen(5939)


	var retrieve = new Retrieve('http://localhost:5939')

	retrieve.getPost('post1.md', function(err, post) {
		t.ifErr(err)
		t.equal(post.metadata.title, 'cool beans', 'first title is correct')

		retrieve.getPost('post1.md', function(err, post) {
			t.ifErr(err)
			t.equal(post.metadata.title, 'cool beans', 'retrieved a cached post')

			t.end()
			server.close()
		})
	})
})

test('Caches based on Last-Modified header', function(t) {
	var lastModified = new Date().toISOString()
	var first = true

	var server = http.createServer(function (req, res) {
		if (first) {
			res.writeHead(200, { 'Last-Modified': lastModified })
			res.write('date: 2016-12-15\ntitle: cool beans\n\nThis is the content\n')
		} else {
			t.equal(req.headers['if-modified-since'], lastModified, 'Expected date')
			res.writeHead(304)
		}
		first = false
		res.end()
	})

	server.listen(5940)


	var retrieve = new Retrieve('http://localhost:5940')

	retrieve.getPost('post1.md', function(err, post) {
		t.ifErr(err)
		t.equal(post.metadata.title, 'cool beans', 'first title is correct')

		retrieve.getPost('post1.md', function(err, post) {
			t.ifErr(err)
			t.equal(post.metadata.title, 'cool beans', 'retrieved a cached post')

			t.end()
			server.close()
		})
	})
})
