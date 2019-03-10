var PouchDB = require('pouchdb');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
PouchDB.plugin(require('pouchdb-find'));

var app = express();

app.use('/', require('express-pouchdb')(PouchDB));

app.listen(3300, '0.0.0.0', function() {
	console.log('PouchDB Server On');
    console.log('Listening to port:  ' + 3300);
});