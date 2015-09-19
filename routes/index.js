var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');

var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;


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
	router.get('/api/venues', function (req, res, next) {
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
	router.get('/api/venues', function (req, res, next) {
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

	router.get('/api/getDay/:day_id', function(req, res) {
	 // make new day
		var dayId = req.params.day_id;
		Day.findOne({_id: dayId}, function(err, data) {
	 	console.log(data);
		 	if(err){
		 		res.send(err);
		 		return;
		 	} else if (data){
	    		res.send(data);
		 	} else {
		 		res.send(false);
		 		// res.send("shit doens't exist");
		 	}
    	});
	});

	router.post('/api/newDay/:day', function(req, res) {
	 // make new day
	 var dayNum = req.params.day;
	 var newDay = Day.create({number: dayNum}, function(err, data) {
	    	res.send(data);
	    });
	});

	router.delete('/api/deleteDay/:day_id', function(req, res) {
	 var dayId = req.params.day_id;
	 Day.findOne({_id: dayId}).remove().exec();
	 res.send(true);
	})

	// router.post('/api/addToDay/:day_id/:venue/:venue_id', function(req, res) {
	//  var dayId = req.params.day_id;
	//  var venue = req.params.venue;
	//  var venueId = req.params.venue_id;
	//  // var currentDay, currentHotel;
	//  Day.findOne({_id: dayId}, function(err, day) {
	//  	day.set('venue',venueId).save(function(err, day){
	//  		res.send(day);
	// 	 	});
	// 	 });
	//  // Promise.all([
	//  // 	,
	//  // 	Hotel.findOne({_id:hotelId},function(err,data) {currendHotel = data})])
	// 	// .then(function(){
	// 	// 	currentDay.set('hotel',hotelId)
	// 	// })
	// });

	router.post('/api/addToDay/:day_id/:venue/', function(req, res) {
	 var dayId = req.params.day_id;
	 var venue = req.params.venue;
	 // console.log(dayId, venue);
	 // console.log(req.body);
	 var venueIds = req.body.data;
	 Day.findOne({_id: dayId}, function(err, day) {
	 	day.set(venue,venueIds).save(function(err, day){
	 		res.send(day);
		 	});
		 });
	});

	return router;
}