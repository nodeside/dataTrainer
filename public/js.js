var form = document.getElementById('file-form');
var fileSelect = document.getElementById('file_upload');
var uploadButton = document.getElementById('upload-btn');

//make button do what input file does
document.getElementById('upload-btn').addEventListener('click', function(e) {
	document.getElementById('file_upload').click()
})

function enableUploadIfValid() {

	// take value of checkbox field
	var checkbox = document.getElementById('tc');
	// take value of email field
	var emailfield = document.getElementById('email').value;
	//value of he button
	var upload = document.getElementById('upload-btn');
	// check both above values using validate email and .checked etc
	if (ValidateEmail(emailfield) == true && checkbox.checked == true) {
		upload.style.cursor = "pointer";
		upload.removeAttribute('disabled');
	} else {
		console.log('no agree')
		upload.style.cursor = "not-allowed";
		upload.setAttribute('disabled', true);
	}

	// if valid. enabled button
	//if not valid disable button
}

document.getElementById('tc').onchange = enableUploadIfValid;

document.getElementById('email').onkeyup = enableUploadIfValid;
setInterval(document.getElementById('email').onchange = enableUploadIfValid, 300);

function ValidateEmail(mail) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return (true)
	}
	return (false)
}



document.getElementById('file_upload').onchange = function(e) {
	var reader = new FileReader();
	reader.addEventListener("loadend", function(arg) {
		var email = document.getElementById('email').value;

		var fileData = {
			data: this.result,
			name: e.target.files[0].name,
			email: email
		};

		

		var fields = this.result.split('\n')[0].split(',');
		var chooseField = document.getElementById("choose-field");
		chooseField.style.display = "block";
		for (var i = 0; i < fields.length; i++) {

			var option = document.createElement("option");
			option.text = fields[i];
			chooseField.add(option);
		}


		chooseField.onchange = function(e) {
			fileData.field = e.target.value;
			//connect to the server
			var xhr = new XMLHttpRequest();

			// Open the connection.
			xhr.open('POST', '/upload', true);

			xhr.setRequestHeader('Content-Type', 'application/json')

			// Set up a handler for when the request finishes.
			xhr.onload = function() {
				if (xhr.status === 200) {
					// File(s) uploaded.
					//uploadButton.innerHTML = 'Upload';
					console.log(xhr.responseText)
				} else {
					alert('An error occurred!');
				}
			};
			var filereceived = document.getElementById("filereceived");
			filereceived.style.display = "block";
			// Send the Data.
			xhr.send(JSON.stringify(fileData));
		}

	});
	reader.readAsText(e.target.files[0]);
}