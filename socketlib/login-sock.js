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
    pgclient.query("INSERT INTO sessions(session_data, session_ip, session_id, session_key, session_useroid, session_cryptoken, session_timestamp) values($1, $2, $3, $4, $5, $6, $7)", querarray, function(err){
        if (err) {console.log(err)}
    });
    login.profile = data.profile;
    login.profile.oid = data.oid;
    var thequery = "select oid,typename,typeforms from contenttypes where typemeta->>'group' = 'admin';";
      simplequery(thequery, socket, function(result) {
	login.forms = result.rows;
	socket.emit('login', login);
      });
  
}

var getAccount = function(account,socket,callback) {
    var thesql = "select oid,profile,credentials from users where ";
    if (!account.username && !account.useroid) {console.log("Incomplete account data");return};
    if (account.useroid) {
        thesql = thesql + "oid = '" + account.useroid + "' limit 1;"
    }else {
        thesql = thesql + "credentials->>'username' = '" + account.username + "' and credentials->>'password' = '" + account.password + "' limit 1;"
    }
    console.log('Yes you are logging in.');
    simplequery(thesql, socket, callback);
}

var getProfile = function(account, socket){
    var thesql = "select htmlblob from content where content->>'group' = '" + account.group + "'";
    simplequery(thesql, socket, function(result){
      account.content = result.rows;
//      console.log("Showing account: ");console.log(account);
      socket.emit('startup', account);
    });
}

var killSession = function(socket){
      console.log("Killing session: " + socket.id);
      socket.emit('terminate', "document.cookie = 'token' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT';console.log('You are logged out.')");  
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
    if (result.rows.length == 1) {
      var account = {}; account.useroid = result.rows[0].session_useroid;account.login = login;
      socket.store.store.clients[socket.id].data.cryptoken = result.rows[0].session_cryptoken;
      getAccount(account, socket, function(result){
        if (account.login.cryptoken === "NoLogin") {
          account.sessionstatus = "anonymous", account.message = "Logged in", account.username = "Login", account.group = "anonymous";
          getProfile(account,socket);
        } else {
          account.sessionstatus = "authenticated", account.message = "Logged in", account.username = result.rows[0].credentials.username, account.cryptoken = socket.store.store.clients[socket.id].data.cryptoken, account.profile = result.rows[0].profile, account.group = result.rows[0].credentials.group };
          getProfile(account,socket);
        });
    } else {
      killSession(socket);
    }
  });
}

exports.endsession = function(datum, socket) {
    var thesql = "delete from sessions where session_cryptoken = '" + datum.cryptoken +"'";  
    simplequery(thesql, socket, function(result) {
      killSession(socket);
    })
}