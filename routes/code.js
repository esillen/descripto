var express = require('express');
var router = express.Router();
var codeGenerator = require('../util/codeGenerator');

/* GET code. */
router.get('/', function(req, res, next) {
  codeGenerator.generateRandomCode((randomCode) => {
    res.send(randomCode);
  })
});


module.exports = router;
