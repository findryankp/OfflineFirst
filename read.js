//Requiring the package
var PouchDB = require('PouchDB');

//Creating the database object
var db = new PouchDB('my_database');
var remoteDB = new PouchDB('http://localhost:3300/my_datadase');

//Reading the contents of a Document
console.log("LOKAL");
db.allDocs({include_docs: true}, function(err, doc) {
   if (err) {
      return console.log(err);
   } else {
      console.log(doc);
   }
});

console.log("SERVER");
remoteDB.allDocs({include_docs: true}, function(err, doc) {
   if (err) {
      return console.log(err);
   } else {
      console.log(doc);
   }
});