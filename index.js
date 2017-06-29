var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');

app.use(bodyParser.json({
	limit: '20mb'
}))

//service static files
app.use(express.static(path.join(__dirname, 'public')));


app.post('/upload', function(req, res, next) {

	var fs = require('fs');

	fs.writeFile(path.join(__dirname, 'uploads', req.body.name), req.body.data, function(err) {
		console.log(req.body.field)
		console.log('File Received')

		var analyzeData = require("./batching_exercise");
		analyzeData.work("req.body.work");
		

	});

	res.status(200).send("done");
})



// run express on a port process.env.PORT || 3003
console.log('Listening on port: ' + (process.env.PORT || 3000));
app.listen(process.env.PORT || 3000);