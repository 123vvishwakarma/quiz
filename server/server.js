// Basic NPM Modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Express framework initialization
var app = express();

// Schema reference
app.schema = {};

// Function Files reference
app.user = require('./adecco/functions/user');

// Data Access Layer reference
app.crud = require('./dal/crud');

// Config reference
app.config = require('./configs/config.js'); 

// Parsing requests
app.use(bodyParser.urlencoded({
	extended: false,
	limit: '50mb'
}));
app.use(bodyParser.json({
	limit: '50mb'
}));

// Set Port
app.set('port', process.env.PORT || 8080);

// Mongoose Database connection (with auto-increment initialization)
var connection = mongoose.connect(app.config.MONGO_URI);
mongoose.connection.on('error', function (err) {
	console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

// API Router reference
require('./router.js')(app);

// Models reference
require('./models')(app, mongoose);

// Server Start
var listener = app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});