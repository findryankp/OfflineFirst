//Requiring the package
var PouchDB = require('PouchDB');

//Creating the database object
var db = new PouchDB('my_database');

//Preparing the document
doc = {
   _id : '001',
   username: 'Huda',
   password: '123456'
   }
//Inserting Document
db.put(doc, function(err, response) {
   if (err) {
      return console.log(err);
   } else {
      console.log("Dokumen berhasil dibuat");
   }
});

doc2 = {
   _id : '002',
   username: 'Princes Zulfa',
   password: '123456'
   }
//Inserting Document
db.put(doc2, function(err, response) {
   if (err) {
      return console.log(err);
   } else {
      console.log("Dokumen berhasil dibuat");
   }
});