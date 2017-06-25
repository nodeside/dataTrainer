var form = document.getElementById('file-form');
var fileSelect = document.getElementById('file_upload');
var uploadButton = document.getElementById('upload-btn');

//make button do what input file does
document.getElementById('upload-btn').addEventListener('click', function(e) {
	document.getElementById('file_upload').click()
})

document.getElementById('file_upload').onchange = function(e) {
	var reader = new FileReader();
	reader.addEventListener("loadend", function(arg) {

		var fileData = {
			data: this.result,
			name: e.target.files[0].name
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

			// Set up a handler?? for when the request finishes.
			xhr.onload = function() {
				if (xhr.status === 200) {
					// File(s) uploaded.
					//uploadButton.innerHTML = 'Upload';
					console.log(xhr.responseText)
				} else {
					alert('An error occurred!');
				}
			};

			// Send the Data.
			xhr.send(JSON.stringify(fileData));
		}

	});
	reader.readAsText(e.target.files[0]);
}