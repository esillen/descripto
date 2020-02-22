var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = process.env.MONGODB_URI;
var client = {};

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  console.log("Connected to mongoDB database!");
  client.databaseObject = database.db(process.env.MONGODB_DESCRIPTO_DATABASE);
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
      if (result.result.nModified == 1) {
        resolve(data);
      } else {
        resolve(result.ops[0]);
      }
    });
  });
}

client.getAll = function(collectionName) {
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

client.findById = function(collectionName, id) {
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