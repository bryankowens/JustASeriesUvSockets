var express = require('express'),
  routes = require('./routes'),
  socket = require('./routes/socket.js'),
  pg = require('pg'),
  client = new pg.Client('postgres://master1:harper123@localhost:5432/mastercontrol');
client.connect();

var app = express();

// Hook Socket.io into Express
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication

io.sockets.on('connection', socket);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port 3000");
});


//var io = socket.listen(server);
var users = [];

io.sockets.on('connection', function (socket) {

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
    });

    socket.on('terminated', function(data){
        console.log("Disconnected: " + data.uid);
        users.splice(users.indexOf(data.uid),1);
        socket.broadcast.to('main').emit("terminated",{uid:data.uid, msg:"Terminated Connection"});
    });

    socket.on('entryping', function (data) {
        console.log("User: " + data.uid + " has deleted ID " + data.statid);
        socket.broadcast.to(data.chat).emit("entrypong",{uid: data.uid, statid: data.statid});
    });

    socket.on('updatestats', function (data) {
        var timeOn = new Date().getTime();
        console.time('sqlperftest')
        var starttime = moment().subtract('minutes', 5).format('YYYY-MM-DD h:mm');
        var nowtime =  moment().format('YYYY-MM-DD h:mm');
        var thesql = "SELECT * FROM servicestatuses WHERE nagiostimeid >= '" + starttime + "' AND nagiostimeid < '" + nowtime + "' AND current_state >= 1 AND current_state < 8";
        client.query(thesql, function(err, result){
            stats.timing('current_alerts', result.rows.length);
            for (row in result.rows){
              var response = JSON.parse("{" + result.rows[row].servicedata.replace(/\=\>/g,":").replace(/NULL/g,'"NULL"') + "}");
              socket.broadcast.to('main').emit("statupdate",{stats:response});
            }
        });

        var timeOff = new Date().getTime();
        var timeDiff = timeOff-timeOn;
        stats.timing('query_response_time', timeDiff);
        console.log("Processing Time Needed: " + timeDiff + "ms");
    });

});