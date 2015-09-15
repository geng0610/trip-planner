var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tripPlannerData');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Place, Hotel, Activity, Restaurant;
var Schema = mongoose.Schema;

// var pageSchema = new Schema({
//   title: { type: String},
//   url_name: String,
//   owner_id:   String,
//   body:   { type: String},
//   date: { type: Date, default: Date.now },
//   status: Number,
//   tags: [String]
// });

// // Omri and I added this so that we wouldn't have to check
// // the length of title in various parts of the code - ZO
// pageSchema.path('title').validate(function(v) {
// 	return v && v.length > 0
// }, "The title must have a length greater than zero")

// pageSchema.methods.computeUrlName = function() {
// 	this.url_name = this.title.replace(/[\W\s]/g, '_');
// }

// pageSchema.statics.findByTag = function(tag, cb) {
// 	this.find({ tags: { $elemMatch: { $eq: tag} } }, cb)
// }

// pageSchema.methods.getSimilar = function(cb) {
// 	this.constructor.find({
// 		_id: { $ne: this._id },
// 		tags: {3
// 			$elemMatch: { 
// 				$in: this.tags
// 			}
// 		}
// 	}, cb)
// }

// pageSchema.pre('save', function(next) {
// 	this.computeUrlName()
// 	next()
// })

// pageSchema.virtual('full_route').get(function() {
// 	return "/wiki/" + this.url_name;
// })

var placeSchema = new Schema({
  name: { type: String},
  city: { type: String},
  state: { type: String},
  phone: { type: String},
  location:  { type: [Number], index: '2d'},
});

var hotelSchema = new Schema({
  name: { type: String},
  place:{type: [placeSchema]},
  num_stars:{type: Number, min: 1, max:5},
  amenities: { type: String}
});

var activitySchema = new Schema({
  name: { type: String},
  place:{type: [placeSchema]},
  age_range:{type: String},
});

var restaurantSchema = new Schema({
  name: { type: String},
  place:{type: [placeSchema]},
  cuisine:{type: String},
  price:{type: String, min: 1, max:5},
});

Place = mongoose.model('Place', placeSchema);
Hotel = mongoose.model('Hotel', hotelSchema);
Activity = mongoose.model('Activity', activitySchema);
Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {
	Place: Place, 
	Hotel: Hotel,
	Activity: Activity,
	Restaurant: Restaurant
};