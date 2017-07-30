var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/test')
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

var schema = mongoose.Schema;

var rowSchema =new schema({
  	"uuid":String,
  	"email":String,
  	"filename":String,
  	"url": String,
  	"urlKey":String,
  	"created": Date,
  	"data": {},
  	"results":{}
  });

var Row = mongoose.model('Row', rowSchema);


// make this available to our users in our Node applications
module.exports = Row;