var PouchDB = require('PouchDB');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
PouchDB.plugin(require('pouchdb-find'));

var db = new PouchDB('my_database');
var remoteDB = new PouchDB('http://localhost:3300/my_datadase')

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/login', function(request, response) {
	
	var username1 = request.body.username;
	var password1 = request.body.password;
	if (username1 && password1) {
		var akun = db.find({ 
			selector: {username : username1,password : password1}})
			.then(function (result) {
			// list of people shown here
			if(result.docs.length>0)
				response.send("Login Success!");
			else
				response.send("User not found!");
		  });
		
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);

