var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');

var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;


module.exports = function(io){
	router.get('/', function (req, res, next) {
		Promise.all([Hotel.find(), Restaurant.find(), Activity.find()])
		.then(function(results){
			var data = {
				Hotels: {type:'Hotels',content:results[0]},
				Restaurants: {type:'Restaurants',content:results[1]},
				Activities: {type:'Activities',content:results[2]},
			};
			res.render('index', {data: data});
		})
	});
	router.get('/api', function (req, res, next) {
		Promise.all([Hotel.find(), Restaurant.find(), Activity.find()])
		.then(function(results){
			var data = {
				Hotels: {type:'Hotels',content:results[0]},
				Restaurants: {type:'Restaurants',content:results[1]},
				Activities: {type:'Activities',content:results[2]},
			};
			res.send(data);
		})
	});

	return router;
}