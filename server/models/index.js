const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose= mongoose;

db.user =  require('./user.model');
db.role =  require('./role.model');
db.recipe =  require('./recipe.model');
db.rating =  require('./rating.model');

module.exports = db;