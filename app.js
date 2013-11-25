#! /usr/bin/env node
"use strict";

var express          = require('express');
var http             = require('http');
var path             = require('path');
var cons             = require('consolidate');
var app              = express();

app.engine('mustache', cons.mustache);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');

app.use(express.static(path.join(__dirname, 'public')));

if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function (req, res) {
	res.render('index', {
		title: 'baer',
	});
});

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
