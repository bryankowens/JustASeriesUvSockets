 var express = require('express')
    , http = require('http')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , moment = require('moment')
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
      console.log(login);
      login.cryptoken == "NoLogon" ? loginsock.anonymous(socket) : loginsock.sessioncheck(login, socket);
    });
    
    //handles login confirmation
    socket.on('login', function(datum){
      loginsock.login(datum,socket);
    });  
    
    socket.on('logout', function(datum){
      loginsock.logout(data,socket);
      //destroy 
    });  
    
    socket.on('submit', function(datum){
      submitsock(datum,socket);
    });
    
    //on disconnection - drop or window close
    socket.on('disconnect', function (socket) {
    // run function to remove session entry with this socket ID?
	if (socket) {console.log("Disconnected from " + socket.id)};
    });

    socket.on('terminate', function(datum){
      loginsock.endsession(datum, socket);
    });

    //on timer'd update - presumably set to 10 seconds
    //sends list of active content objects, confirms SID and timestamp
    //

});