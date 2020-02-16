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
  return new Promise((resolve, reject) => {
    this.databaseObject.collection(collectionName).insertOne(data, function(error, result) {
      if (error) {
        reject(error);
      }
      console.log("inserted a document!");
      resolve(result);
    });
  });
}

client.save = function(collectionName, data) {
  return new Promise((resolve, reject) => {
    this.databaseObject.collection(collectionName).save(data, function(error, result) {
      if (error) {
        reject(error);
      }
      console.log("Saved object!!");
      resolve(result);
    });
  });
}

client.getAll = function(collectionName, callback) {
  return new Promise((resolve, reject) => {
    this.databaseObject.collection(collectionName).find({}).toArray(function(error, result) {
      if (error) {
        reject(error);
      }
      console.log("retrieved records!");
      resolve(result);
    });
  });
}

client.findById = function(collectionName, id, callback) {
  return new Promise((resolve, reject) => {
    this.databaseObject.collection(collectionName).findOne({'_id':ObjectID(id)}, function(error, result) {
      if (error) {
        reject(error);
      }
      console.log("found something!")
      resolve(result);
    });
  });
}


module.exports = client;