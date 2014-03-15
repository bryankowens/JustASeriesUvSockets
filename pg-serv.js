 var express = require('express')
    , http = require('http')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , moment = require('moment')
    , nodesock = require('./socketlib/node-sock')
    , loginsock = require('./socketlib/login-sock')
    , submitsock = require('./socketlib/submit-sock');
    
app.configure(function(){
    app.use(express.static(__dirname + '/'));
});

app.configure(function(){
    app.use(express.bodyParser());
});

server.listen(process.env.PORT || 3000);
var data = [{text:'build an angular app', done:false}];

io.sockets.on('connection', function (socket) {
    io.set('log level', 1);
    
    socket.on('startup', function(login){
      console.log("Start me up!");
      loginsock.sessioncheck(login, socket);
    });
    
    //handles login confirmation
    socket.on('login', function(datum){
      loginsock.login(datum,socket);
    });
    
    socket.on('submit', function(datum){
      submitsock.submission(datum,socket);
    });

    socket.on('terminate'||'disconnect' || 'logout', function(datum){
      loginsock.endsession(datum, socket);
    });
    
    socket.on('update', function(datum){
      nodesock.update(datum,socket);
    });

    //on timer'd update - presumably set to 10 seconds
    //sends list of active content objects, confirms SID and timestamp
    //
});