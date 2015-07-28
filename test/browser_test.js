var launch = require('chrome-launch')
var fakeoServer = require('./fakeo_remote_server/http.js')

var server = fakeoServer(8989)
var browserWindow = launch('http://127.0.0.1:8989/browser.html')
browserWindow.on('exit', server.close.bind(server))
