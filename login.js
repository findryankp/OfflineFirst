var PouchDB = require('PouchDB');
var express = require('express');
var redirect = require('express-redirect');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
PouchDB.plugin(require('pouchdb-find'));

var db = new PouchDB('my_database');
var remoteDB = new PouchDB('http://localhost:3300/my_databases');

var db2 = new PouchDB('log');
var remoteDB2 = new PouchDB('http://localhost:3300/logs');

var app = express();
redirect(app);

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

db.sync(remoteDB, {
	live: true,
	retry: true
  }).on('change', function (change) {
	console.log('synced success');
  }).on('paused', function (info) {
	console.log('synced pause lost connection'); // replication was paused, usually because of a lost connection
  }).on('active', function (info) {
	console.log('synced live again');// replication was resumed
  }).on('error', function (err) {
	console.log('synced GAGAL');// totally unhandled error (shouldn't happen)
  });

db2.replicate.to(remoteDB2, {
	live: true,
	retry: true
  }).on('change', function (change) {
	console.log('replicate success');
  }).on('paused', function (info) {
	console.log('replicate pause lost connection'); // replication was paused, usually because of a lost connection
  }).on('active', function (info) {
	console.log('replicate live again');// replication was resumed
  }).on('error', function (err) {
	console.log('replicate GAGAL');// totally unhandled error (shouldn't happen)
  });

function LogStatus(status,username) {
	var currentdate = new Date();
	console.log(currentdate.toString());
	doc = {
		_id:currentdate.getTime().toString(),
		waktu : currentdate.toString(),
		username: username.toString(),
		status : status.toString()
	}
	//Inserting Document
	db2.put(doc, function(err, response) {
		if (err) {
			return console.log(err);
		}
	})
}

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
			{
				response.send("Login Success!");
				status = "Login Success";
			}
			else
			{
				status = "Login Gagal";
				response.send("User not found!");
			}
		  }).then(function(req,res){
				LogStatus(status,username1);
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

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

app.post('/register', function(request, response) {
	id = Math.floor(Math.random()*(999-100+1)+100);
	id.toString();
	var username2 = request.body.username;
	var password2 = request.body.password;

	id += 1;
	if (username2 && password2) 
	{
		//inputUsername = 
		doc = {
		   _id : id.toString(),
		   username: username2.toString(),
		   password: password2.toString()
		   }
		//Inserting Document
		remoteDB.put(doc, function(err, res) 
		{
		   if (err) 
		   {
		      	return console.log(err);
		   } 
		   else 
		   {
		    	console.log("User " + username2 + " created Successfully");
		   }
		}).then(
			function(req,res){
				response.writeHead(301,
				  {Location: '/'}
				);
				response.end();
			}
		);
	} 
	else 
	{
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.listen(3000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 3000);
});

