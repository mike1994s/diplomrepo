var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var config = require('../config')
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;
