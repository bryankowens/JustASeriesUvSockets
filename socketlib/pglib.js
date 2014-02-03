var pg = require('pg')
    ,pgclient = new pg.Client('postgres://master1:harper123@localhost:5432/mastercontrol');


pgclient.connect();

exports.login = function(data) {

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

// login 
// -check existing
// -authenticate credentials
// -assign cookie and session data
// -pulling user data



    // content entry function
    // - query articles with admin/edit perm
    
    // admin page
    // profile page
    // content selection
    