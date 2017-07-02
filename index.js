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

		// var analyzeData = require("./batching_exercise");
		// analyzeData.work(req.body.work);
		var helper = require('sendgrid').mail;
		var fromEmail = new helper.Email('test@example.com');
		var toEmail = new helper.Email('yonatan@nodeside.com');
		var subject = 'Sending with SendGrid is Fun';
		var content = new helper.Content('text/plain', 'hellllooooooooo yonanta,, good shabos!');

		var mail = new helper.Mail(fromEmail, subject, toEmail, content);
		var attachment = new helper.Attachment();
		var file = req.body.data;
		var base64File = new Buffer(file).toString('base64');
		attachment.setContent(base64File);
		attachment.setType('application/text');
		attachment.setFilename('my_file.txt');
		attachment.setDisposition('attachment');
		mail.addAttachment(attachment);

		var sg = require('sendgrid')(process.env.sendgridAPI);
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

	res.status(200).send("done");
})



// run express on a port process.env.PORT || 3003
console.log('Listening on port: ' + (process.env.PORT || 3000));
app.listen(process.env.PORT || 3000);