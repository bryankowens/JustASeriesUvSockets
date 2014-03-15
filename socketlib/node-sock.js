var pg = require('pg')
  , CryptoJS = require('crypto-js')
  ,pgclient = new pg.Client('postgres://master1:harper123@localhost:5432/mastercontrol');

pgclient.connect();

var simplequery = function(thequery, socket, callback) {
  pgclient.query(thequery, function(err, result){
    if (err) {console.log("QUERY: " + thequery);console.log("ERROR: " + err)};
    callback(result);
  });
};

exports.update = function(datum, socket) {
  var when = Date.now() - 60000;  
  thequery = "select * from content where contentmeta->>'contenttype' = '32866' and stamps->>'created' > '" + when + "'";
  simplequery(thequery, socket, function(result){
    if (result.rows) {
      socket.emit('update', result.rows);
    }
  });   
  
}