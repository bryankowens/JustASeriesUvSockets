var pg = require('pg')
  , CryptoJS = require('crypto-js')
  ,pgclient = new pg.Client('postgres://master1:harper123@localhost:5432/mastercontrol');

pgclient.connect();

var itexists = function(data,socket,login){
    for (client in socket.store.store.clients) {
      console.log(login.username + " is logging in.  Comparing to session: " + client);
      if (login.username == socket.store.store.clients[client].data.username) {login.sessionstatus = "duplicate"};
    };
    console.log("STATUS: "+ login.username + login.sessionstatus);
    socket.store.store.clients[client].data.username = login.username;
    socket.emit('login', login.sessionstatus == "authenticated" ? data.rows[0].profile : "Not Authenticated");
}

exports.func = function(datum,socket){   
  var data = JSON.parse(CryptoJS.AES.decrypt(datum, socket.id).toString(CryptoJS.enc.Utf8));
      console.log(data);
  var thesql = "select profile from users where credentials->>'username' = '" + data.username + "' and credentials->>'password' = '" + data.password + "' limit 1;"
      pgclient.query(thesql, function(err, result) {
	if (err) {console.log("ERROR: " + err)};
	if (result.rows.length == 1) {
	  var login = {sessionstatus: "authenticated", message: "Logged in",sessionid: socket.id, username:data.username};
	  itexists(result,socket,login);
	}
	else {
	  var login = {sessionstatus: "invalid", message: "Incorrect credentials.",sessionid: socket.id, username:data.username};
	  itexists(data,socket,login);
	}
      });
}

exports.logout = function(){
  var data = JSON.parse(CryptoJS.AES.decrypt(datum, socket.id).toString(CryptoJS.enc.Utf8));
  var thesql = "select profile from users where credentials->>'username' = '" + data.username + "' and credentials->>'password' = '" + data.password + "' limit 1;"
  
}

exports.existing = function(data,socket,login){
    for (client in socket.store.store.clients) {
      console.log(data);
      console.log(login.username + " is logging in.  Comparing to session: " + client);
      if (login.username == socket.store.store.clients[client].data.username) {login.sessionstatus = "duplicate"};
    };
    console.log("STATUS: " + login.sessionstatus);
    socket.store.store.clients[client].data.username = login.username;
    socket.emit('login', login.sessionstatus == "authenticated" ? data.rows[0].profile : "Not Authenticated");
}

// login 
// -check existing
// -authenticate credentials
// -assign cookie and session data
// -pulling user data

