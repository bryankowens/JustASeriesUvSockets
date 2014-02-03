var express = require('express')
    , http = require('http')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , moment = require('moment')
    , pg = require('pg');

app.configure(function(){
    app.use(express.static(__dirname + '/'));
});

app.configure(function(){
    app.use(express.bodyParser());
});

server.listen(process.env.PORT || 3000);

var users = [];
var data = [{text:'build an angular app', done:false}];

io.sockets.on('connection', function (socket) {

    socket.emit('change', data);
    
    socket.on(remit.name, remit.purpose);
    
    socket.on('change', function(obj) {
        console.log(obj);
        data = obj;
        socket.broadcast.emit('change', data);
    });
    
    socket.on('cookies', function(obj){
      console.log("THE COOKIE SAYS: " + obj.whenever);
    });

    socket.on('disconnect', function (socket) {
        console.log("Disconnected");
    });

    socket.emit("pong",{uid:"MCP",msg:"Connected to server",userlist:users});
    socket.on('ping', function (data) {
        console.log("Logging: " + data.uid + " : " + data.msg);
        socket.broadcast.to('main').emit("pong",{uid:data.uid, msg:data.msg});
    });
    socket.on('login', function (data) {
        users.push(data.uid);
        console.log("User: " + data.uid + " : " + data.msg + data.chat);
        socket.join(data.chat);
        socket.username = data.uid;
        socket.broadcast.to(data.chat).emit("pong",{uid:"MCP", msg: data.uid + " has logged in.", userlist:users});
        console.log("Current users: " + users);
        console.log("SOCKET IS:");
        console.log(socket);
    });

    socket.on('terminated', function(data){
        console.log("Disconnected: " + data.uid);
        users.splice(users.indexOf(data.uid),1);
        socket.broadcast.to('main').emit("terminated",{uid:data.uid, msg:"Terminated Connection"});
    });

    socket.on('entryping', function (data) {
        console.log("User: " + data.uid + " has deleted ID " + data.statid);
        socket.broadcast.to(data.chat).emit("entrypong",{uid: data.uid, statid: data.statid});
        console.log(data);
    });
});