var csvjson = require('csvjson');

var fs = require('fs');
var path = require('path');
var data = fs.readFileSync(path.join(__dirname, 'upload'), {
	encoding: 'utf8'
})

var options = {
	delimiter: ',', // optional 
	quote: '"' // optional 
}


var d = csvjson.toObject(data, options);

var batches = [];
var len;
for (var i = 0, len = d.length; i < len; i += 20) {

	batches.push(d.slice(i, i + 20));

}

var request = require('request');
var url = require('url');



var async = require('async');

async.mapSeries(batches, goThroughSeries, completedSeries);


function goThroughSeries(batch, cb) {

	async.map(batch, goThroughEachOne, endLoop)

	function goThroughEachOne(item, cb) {

		//here you will make the request to israelhayom
		// we only want the title of the video

		item.isShopifyStore = false;
		item.webpageLoads = false;

		var url = item.web.toLowerCase();

		if (!url.length) {
			return cb(null, item);
		}

		if (url.indexOf('http') == -1) {
			url = 'http://' + url;
		}



		request(url, function(error, response, body) {
			// console.log('error:', error); // Print the error if one occurred 
			// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
			// console.log('body:', body); // Print the HTML for the Google homepage. 
			console.log(url);

			if (!error && body) {
				item.webpageLoads = true;
			}

			if (!error && body && body.indexOf('shopify.com') !== -1) {
				console.log('has shopify');
				item.isShopifyStore = true;

			}

			cb(null, item);

		});


	};

	function endLoop(err, results) {

		console.log('done looping over a single batch')
		setTimeout(function() {
			cb(err, results)
		}, 500);
	};

};



function completedSeries(err, results) {

	console.log('finished each series')

	var data = []
	for (var index in results) {
		data  = data.concat(results[index]);
	}
	

	var options = {
		delimiter: ",",
		wrap: false
	}
	fs.writeFileSync('./asd.csv',csvjson.toCSV(data, options));

};