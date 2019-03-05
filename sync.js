var PouchDB = require('PouchDB');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
PouchDB.plugin(require('pouchdb-find'));

var db = new PouchDB('my_database');
var remoteDB = new PouchDB('http://localhost:3300/my_datadase');

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