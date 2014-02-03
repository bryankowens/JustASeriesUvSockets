var pg = require('pg')
  , CryptoJS = require('crypto-js')
  ,pgclient = new pg.Client('postgres://master1:harper123@localhost:5432/mastercontrol');

pgclient.connect();

exports.newcontenttype = function(data,socket){   
  var thesql = "INSERT INTO contenttype() and credentials->>'password' = '" + data.password + "' limit 1;"
  var querarray = [data.typemeta, data.typestamps, data.typename, data.typefields, data.typeform];
  client.query("INSERT INTO testdata(typemeta, typestamps, typename, typefields, typeform) values($1, $2, $3, $4, $5, $6)", querarray);

  
  
}