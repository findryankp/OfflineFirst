var PouchDB = require('PouchDB');

//Creating the database object
var db = new PouchDB('my_database');

db.destroy();