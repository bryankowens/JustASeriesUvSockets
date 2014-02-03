var pg = require('pg')
  , CryptoJS = require('crypto-js')
  ,pgclient = new pg.Client('postgres://master1:harper123@localhost:5432/mastercontrol');

pgclient.connect();

var Auth = {
  s4: function () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  },
  guid: function (size) {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4() + this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }
}

var simplequery = function(thequery, socket, callback) {
  pgclient.query(thequery, function(err, result){
    if (err) {console.log("QUERY: " + thequery);console.log("ERROR: " + err)};
    callback(result);
  });
};

var validate = function(data, socket,login) {
    var session_key = Auth.guid();
    login.cryptoken = CryptoJS.AES.encrypt(data.credentials.magiccrypto, session_key).toString();

    var querarray = ['{"somedata":"Now with values!"}', socket.handshake.address.address, socket.id, session_key, data.oid, login.cryptoken, Date.now()];
    console.log(querarray);
    pgclient.query("INSERT INTO sessions(session_data, session_ip, session_id, session_key, session_useroid, session_cryptoken, session_timestamp) values($1, $2, $3, $4, $5, $6, $7)", querarray, function(err){
        if (err) {console.log(err)}
    });
    login.profile = data.profile;
    socket.emit('login', login);
}

//function getAccount({userID, user_iod, password})
var getAccount = function(account,socket,callback) {
    var thesql = "select oid,profile,credentials from users where ";
    if (!account.username && !account.useroid) {console.log("Incomplete account data");return};
    if (account.useroid) {
        thesql = thesql + "oid = '" + account.useroid + "' limit 1;"
    }else {
        thesql = thesql + "credentials->>'username' = '" + account.username + "' and credentials->>'password' = '" + account.password + "' limit 1;"
    }
    simplequery(thesql, socket, callback);
}

exports.login = function(data,socket){
    getAccount(data, socket, function(result){
        if (result.rows.length == 1) {
            var login = {sessionstatus: "authenticated", message: "Logged in", username:data.username};
            validate(result.rows[0],socket,login);
        }
        else {
            var login = {sessionstatus: "invalid", message: "Incorrect credentials.", username:data.username};
            socket.emit('login', login);
        }
    });
}

exports.sessioncheck = function(login, socket){
  var thesql = "select * from sessions where session_cryptoken = '" + login.cryptoken +"'";
  simplequery(thesql, socket, function(result) {
    console.log(result.rows[0]);
    if (result.rows.length == 1) {
      var account = {}; account.useroid = result.rows[0].session_useroid;
//      var data = JSON.parse(CryptoJS.AES.decrypt(datum, socket.id).toString(CryptoJS.enc.Utf8));
      socket.store.store.clients[socket.id].data.cryptoken = result.rows[0].session_cryptoken;
      console.log(account);
      getAccount(account, socket, function(result){
        var login = {sessionstatus: "authenticated", message: "Logged in", username:result.rows[0].credentials.username, cryptoken: socket.store.store.clients[socket.id].data.cryptoken, profile:result.rows[0].profile};
        socket.emit('login', login);
      });
    } else {
      console.log("Or else what??");
      socket.emit('terminate', "delete $cookies.token");
    }
  });
}

exports.endsession = function(datum, socket) {
//  var thesql = "delete from sessions where session_useroid = 24584"
    var thesql = "delete from sessions where session_cryptoken = '" + datum.cryptoken +"'";  
    console.log(thesql);
    simplequery(thesql, socket, function(result) {
      console.log(result);
    })
}

//function getSession({cryptoken, ip address, socket id}
//function getDisplay() - blocks, menu

exports.logout = function(){
  var data = JSON.parse(CryptoJS.AES.decrypt(datum, socket.id).toString(CryptoJS.enc.Utf8));
  var thesql = "select profile from users where credentials->>'username' = '" + data.username + "' and credentials->>'password' = '" + data.password + "' limit 1;"
}

exports.anonymous = function(socket){
  var thesql = "select htmlblob from content where content->>'type' = 'login' limit 1;"
    simplequery(thesql, socket, function(result) {
      if (result.rows.length == 1) {
	  socket.emit('startup', result.rows[0].htmlblob);

	}
	else {
	  console.log("STARTUP QUERY PRODUCED TOO MANY RESULTS");
	}
    });
}

exports.terminate = function(datum,socket){
    //erase all session entries with that token, IP address
    console.log("Terminating session?");
    socket.emit('terminate', "delete $cookies.token");  
}