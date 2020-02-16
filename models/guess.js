var schemas = require("./schemas.js");
var _ = require("lodash");
var Game = require('./game');

var Guess = function(data) {
  this.data = data;
};

Guess.prototype.data = {};

Guess.prototype.sanitize = function(data) {
  data = data || {};
  schema = schemas.guess;
  return _.pick(_.defaults(data, schema), _.keys(schema));
};

module.exports = Guess;
