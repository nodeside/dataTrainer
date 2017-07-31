var csvjson = require('csvjson');

var _ = require('lodash');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var request = require('request');
var url = require('url');
var async = require('async');


function work(options, callback) {

	var fileIdentifier = options.uuid;

	var Row = mongoose.model('Row');

	function saveRow(data, callback) {

		var row = new Row({
			'uuid': fileIdentifier,
			'email': options.email,
			'filename': options.filename,
			'url': data.item[options.field],
			'urlKey': options.field,
			'created': new Date(),
			'data': data.item,
			'results': data.results
		});

		row.save(function(err, status) {
			callback(err, row);
		});
	}

	var d = csvjson.toObject(options.data, {
		delimiter: ',', // optional 
		quote: '"' // optional 
	});

	var batches = [];
	var len;


	for (var i = 0, len = d.length; i < len; i += 20) {

		batches.push(d.slice(i, i + 20));

	}



	async.mapSeries(batches, goThroughSeries, completedSeries);


	function goThroughSeries(batch, cb) {

		async.map(batch, goThroughEachOne, endLoop)

		function goThroughEachOne(item, cb) {



			var results = {
				isShopifyStore: false,
				loaded: false
			}


			/*item.serverType = null;
			item.contentType = null;
			item.poweredBy = null;*/

			var url = item[options.field].toLowerCase();

			if (!url.length) {
				return saveRow({
					item: item,
					results: results
				}, cb);
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
					results.loaded = true;
				}

				if (!error && body && body.indexOf('shopify.com') !== -1) {
					results.isShopifyStore = true;

				}

				// if (response && response.headers) {
				// 	results.serverType = response.headers.server;
				// 	results.poweredBy = response.headers['x-powered-by'];
				// 	results.contentType = response.headers['content-type'];

				// }


				saveRow({
					item: item,
					results: results
				}, cb);
			});


		};

		function endLoop(err, results) {

			console.log('done looping over a single batch')
			setTimeout(function() {
				cb(err, results)
			}, 10);
		};

	};



	function completedSeries(err, results) {


		Row.find({
			uuid: fileIdentifier
		}).exec(function(err, docs) {

			var resultsArray = [];

			docs.forEach(function(doc) {
				resultsArray.push({data:doc.data, results:doc.results});
			});

			var csvData = csvjson.toCSV(resultsArray, {
				delimiter: ",",
				wrap: false
			});

			callback(null, {
				data: csvData,
				filename: options.filename
			})
		})

	};
};
module.exports = {
	work: work
}