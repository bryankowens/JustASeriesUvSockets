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

exports.newcontenttype = function(data,socket){   
  var thesql = "INSERT INTO contenttype() and credentials->>'password' = '" + data.password + "' limit 1;"
  var querarray = [data.typemeta, data.typestamps, data.typename, data.typefields, data.typeform];
  client.query("INSERT INTO testdata(typemeta, typestamps, typename, typefields, typeform) values($1, $2, $3, $4, $5, $6)", querarray);

}

exports.submission = function(datum, socket) {
  
  var created = {"created": new Date().getTime()}
  var contentmeta = {"contenttype":datum.content.id,"author":[datum.author]}
  var querarray = [datum.content, created, contentmeta];
  pgclient.query("INSERT INTO content(content, stamps, contentmeta) values($1, $2, $3)", querarray);
}