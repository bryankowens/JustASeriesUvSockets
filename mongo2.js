var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if(err) throw err;

  var collection = db
    .collection('chat')
    .find({content:{$exists:true}}, {content:1, _id:0})
    .limit(100)
    .toArray(function(err, docs) {
      
      for (entry in docs){
	console.dir(docs[entry].content);
      }
  });
});