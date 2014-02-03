var express = require('express')
    , http = require('http')
    , app = express()
    , fs = require('fs')
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);
    
app.configure(function(){
    app.use(express.static(__dirname + '/'));
});

app.configure(function(){
    app.use(express.bodyParser());
});

var drawer = [];
var routePath = "./socks/";
fs.readdirSync('./socks').forEach(function(file) {
    drawer[file.substr(0, file.indexOf('.'))] = require('./socks/'+file);
});

server.listen(process.env.PORT || 3000);
var data = [{text:'build an angular app', done:false}];

io.sockets.on('connection', function (socket) {
    io.set('log level', 0);
    socket.emit('startup', socket.id); //send the initial startup sequence
    
    for (sock in drawer) {
      console.log("Socket function is : " + sock);
      socket.on(sock, function(){
	drawer[sock].func(socket);
      });
    }
});