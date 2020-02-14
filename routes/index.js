var express = require('express');
var router = express.Router();
var words = require('../db/words');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/word', function(req, res, next) {
  words.getAllWords((allWords) => {
    console.log(allWords);
    res.send(allWords);
  });
})

router.post('/word', function (req, res) {
  console.log("about to add " + req.body);
  var checkedObject = {
    name : req.body.name
  }
  words.addWord(checkedObject);
  res.send('Got a POST request');
})

router.get('/code', function(req, res, next) {
  
})

module.exports = router;
