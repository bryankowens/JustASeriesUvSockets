var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
    	    
    for(x in [1,2,3,4,5,6,7,8,9]){	    
      db.collection('test').insert({hello: ['world', 'world again'], someday: Date.now()}, function(err, objects) {
	if (err) console.warn(err.message);
	if (err && err.message.indexOf('E11000 ') !== -1) {
	  // this _id was already inserted in the database
	}
      });
    };  
  });


MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if(err) throw err;
    	    
  db.collection('test').insert({hello: ['world', 'world again'], someday: Date.now()}, function(err, objects) {
      if (err) console.warn(err.message);
      if (err && err.message.indexOf('E11000 ') !== -1) {
	// this _id was already inserted in the database
      }
  });
});



MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    var collection = db
      .collection('test')
      .find({})
      .limit(10)
      .toArray(function(err, docs) {
        console.dir(docs);
    });
  });