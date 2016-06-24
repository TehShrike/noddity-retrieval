module.exports = function() {
	try {
		return (window && window.location && parseInt(location.port, 10)) || 8989
	}  catch (e) {
		return 8989
	}
}
