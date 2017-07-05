var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var analyzeData = require("./batching_exercise");

app.use(bodyParser.json({
	limit: '20mb'
}))

//service static files
app.use(express.static(path.join(__dirname, 'public')));


app.post('/upload', function(req, res, next) {

	var fs = require('fs');

	//fs.writeFile(path.join(__dirname, 'uploads', req.body.name), req.body.data, function(err) {

	console.log(req.body.field)
	console.log('File Received')

	res.status(200).send({
		message: "Processing... An email will be sent with the processed file once complete"
	});

	//analyze the data in the csv, looking for "shopify.com "
	analyzeData.work({
		data: req.body.data,
		field: req.body.field,
		filename: req.body.name
	}, function(err, result) {

		
		
			var theEmail = function(){
			app.use(bodyParser.urlencoded({ extended: true }))
			app.post('emailupload', function(req, res) {
  			res.send(req.body.writeemail)});
  			console.log(req.body.writeemail)
};


		var helper = require('sendgrid').mail;
		var fromEmail = new helper.Email('Wodil@nodeside.com');
		var toEmail = new helper.Email(req.body.writeemail);
		
		var subject = 'Revised File Attached';
		var content = new helper.Content('text/plain', 'This is an email with an attachment!');

		var mail = new helper.Mail(fromEmail, subject, toEmail, content);
		var attachment = new helper.Attachment();
		var file = result.data;
		var base64File = new Buffer(file).toString('base64');
		attachment.setContent(base64File);
		attachment.setType('application/text');
		attachment.setFilename('revised_' + result.filename);
		attachment.setDisposition('attachment');
		mail.addAttachment(attachment);

		var sg = require('sendgrid')(process.env.sendgridKey);
		var request = sg.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: mail.toJSON()
		});

		sg.API(request, function(error, response) {
			if (error) {
				console.log('Error response received');
			}
			console.log(response.statusCode);
			console.log(response.body);
			console.log(response.headers);
		});


	});



	// var nodemailer = require('nodemailer');

	// //var transport = req.body.work;

	// let transporter = nodemailer.createTransport(transport);

	// transporter.sendMail(
	// 	message = {
	// 		from: 'david@nodeside.com',
	// 		to: 'schwartzdavid2@gmail.com',
	// 		subject: 'Your information is Ready!',
	// 		text: 'We have completed analyzing your data. The updated CSV file is attached!',
	// 		html: '<p>HTML version of the message</p>'
	// 		// attachments: {
	// 		// 	// stream as an attachment
	// 		// 	filename: 'text4.txt',
	// 		// 	content: fs.createReadStream('req.body.work')
	// 		// },
	// 	}, callback);


});


//})



// run express on a port process.env.PORT || 3003
console.log('Listening on port: ' + (process.env.PORT || 3000));
app.listen(process.env.PORT || 3000);