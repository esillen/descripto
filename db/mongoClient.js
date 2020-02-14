var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/mydb";
var client = {};

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  console.log("Connected to mongoDB database!");
  client.databaseObject = database.db("mydb");
});

client.insertOne = function(collectionName, data) {
  this.databaseObject.collection(collectionName).insertOne(data, function(err, res) {
    if (err) throw err;
    console.log("inserted a document!");
  });
}

client.save = function(collectionName, data) {
  this.databaseObject.collection(collectionName).save(data, function(err, res) {
    if (err) throw err;
    console.log("Saved object!!");
    console.log(data);
  });
}

client.getAll = function(collectionName, callback) {
  this.databaseObject.collection(collectionName).find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log("retrieved records!");
    callback(result);
  });
}

client.findById = function(collectionName, id, callback) {
  this.databaseObject.collection(collectionName).findOne({'_id':ObjectID(id)}, function(err, result) {
        if (err) throw err;
        console.log("found something!")
        console.log(result);
        callback(result);
     });
}


module.exports = client;