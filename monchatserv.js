var express = require('express')
    , http = require('http')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , moment = require('moment')
    , pg = require('pg')
    , MongoClient = require('mongodb').MongoClient;
    

app.configure(function(){
    app.use(express.static(__dirname + '/'));
});

app.configure(function(){
    app.use(express.bodyParser());
});

server.listen(process.env.PORT || 3000);
var data = [{text:'build an angular app', done:false}];

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
   
    io.sockets.on('connection', function (socket) {

	socket.emit('change', data);
	
	socket.on('change', function(obj) {
	    console.log(obj);
	    data = obj;
	    socket.broadcast.emit('change', data);
	    db.collection('chat').insert({hello: ['world', 'world again'], someday: Date.now(), content:data}, function(err, objects) {
	    if (err) console.warn(err.message);
	    if (err && err.message.indexOf('E11000 ') !== -1) {
	      // this _id was already inserted in the database
	    }
	  });
	    var datum = {hello: ['world', 'world again'], someday: Date.now(), content:data};
	    socket.emit('notice', datum);
	});
	
	socket.on('cookies', function(obj){
	  console.log("THE COOKIE SAYS: " + obj.whenever);
	});

	socket.on('disconnect', function (socket) {
	    console.log("Disconnected");
	});

	socket.on('terminated', function(data){
	    console.log("Disconnected: " + data.uid);
	    users.splice(users.indexOf(data.uid),1);
	    socket.broadcast.to('main').emit("terminated",{uid:data.uid, msg:"Terminated Connection"});
	});

    });		    

});