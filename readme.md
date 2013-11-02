Noddity Retrieval
=====

So I have this idea, right?  Where your blog posts could just be a directory with an index file and a bunch of markdown files, just being served out onto the internet.

The general idea is that your root directory of posts contains:

- An index.json file, containing a JSON array of strings representing the file names that are your "official" blog posts, in order.
- Whatever content files you want to be accessible, in plain text, with metadata stored in a format amenable to [text-metadata-parser](https://github.com/TehShrike/text-metadata-parser).  Markdown recommended.

Useage
-----

```js
	var retrieve = new Retrieve('http://remote-server.com/blogfiles/')

	retrieve.getIndex(function(err, index) {
		if (!err && index.length > 0) {
			// Get the most recent post
			retrieve.getPost(index.pop(), function(err, post) {
				console.log("Found post named " + post.metadata.title)
				console.log("The words inside it are:\n" + post.content)
			})
		}
	})

```

Or whatever.  If my blog ever becomes something like a more useful framework, I might come out and flesh this stuff out a bit.

License 
-----
[WTFPL](http://wtfpl2.com/)
