var http = require('http')
var test = require('tape')
var Retrieve = require('../')


test('Caches based on etag header', function(t) {
	var etag = 'abcdefghijklmnopqrstuvwxyz123456'
	var first = true

	var server = http.createServer(function (req, res) {
		if (first) {
			res.writeHead(200, {
				'ETag': etag
			})
			res.write('date: 2016-12-15\ntitle: cool beans\n\nThis is the content\n')
			res.end()
			first = false
		} else {
			t.equal(req.headers['if-none-match'], etag, 'Expected etag')
			res.writeHead(304, {
				'ETag': etag
			})
			res.write('date: 2000-01-01\ntitle: hot potatoes\n\nThis is different, but will not get detected because cache\n')
			res.end()
		}
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

/*
test('Caches based on Last-Modified header', function(t) {
	var lastModified = new Date().toISOString()
	var first = true

	var server = http.createServer(function (req, res) {
		if (first) {
			res.writeHead(200, {
				'Last-Modified': lastModified
			})
			res.write('date: 2016-12-15\ntitle: cool beans\n\nThis is the content\n')
			res.end()
			first = false
			console.log('first', req.headers)
		} else {
			console.log('not first', req.headers)
			// t.equal(req.headers['If-Modified-Since'], lastModified, 'Expected date')
			res.writeHead(304, {
				'Last-Modified': lastModified
			})
			res.write('date: 2000-01-01\ntitle: hot potatoes\n\nThis is different, but will not get detected because cache\n')
			res.end()
		}
	})

	server.listen(5940)


	var retrieve = new Retrieve('http://localhost:5940')

	retrieve.getPost('post1.md', function(err, post) {
		t.ifErr(err)
		t.equal(post.metadata.title, 'cool beans', 'first title is correct')

		retrieve.getPost('post1.md', function(err, post) {
			t.ifErr(err)
			console.log(post)
			t.equal(post.metadata.title, 'cool beans', 'retrieved a cached post')

			t.end()
			server.close()
		})
	})
})
*/
