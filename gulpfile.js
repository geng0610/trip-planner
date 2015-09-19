var gulp  = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');

// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});

// define the default task and add the watch task to it
gulp.task('default', ['express','watch']);

// initializing express
gulp.task('express', function() {
	var express = require('express');
	var http = require('http');
	var bodyParser = require('body-parser');
	var morgan = require('morgan');
	var swig = require('swig');
	var socketio = require('socket.io');


	var app = express(); // creates an instance of an express application
	//app.use(require('connect-livereload')({port: 4002}));

	var server = app.listen(process.env.PORT || 3000);
	var io = socketio.listen(server);
	var routes = require('./routes/');
	swig.setDefaults({ cache: false });

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json());

	// Set up a server
	app.use('/', routes(io));
	app.use(express.static(__dirname + '/public'));
	app.use('/bower_components', express.static('bower_components'));

	app.use(morgan('dev'));
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', process.cwd() + '/views');
	app.use(function(req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});

	// handle all errors (anything passed into `next()`)
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    console.log({error: err});
	    res.render('error');
	});
});

gulp.task('jshint', function() {
  //return gulp.src('source/javascript/**/*.js')
  return gulp.src('source/js/app.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('build-js', function() {
  return gulp.src('source/js/**/*.js')
    .pipe(sourcemaps.init())
      //.pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      //.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'))
    .pipe(livereload());
});

gulp.task('build-css', function() {
  return gulp.src('source/scss/**/*.scss')
	.pipe(sourcemaps.init())  // Process the original sources
	.pipe(sass().on('error', sass.logError))
	.pipe(sourcemaps.write()) // Add the map to modified source.
	.pipe(gulp.dest('source/css'))
	.pipe(concat('style.css'))
	.pipe(gulp.dest('public/css'))
	.pipe(livereload());
});

gulp.task('html-reload', function() {
  return gulp.src('views/*.html')
    .pipe(livereload());
});

gulp.task('routes-reload', function() {
  return gulp.src('routes/*.js')
    .pipe(livereload());
});



// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
	livereload.listen();
  gulp.watch('source/js/app.js', ['jshint']);
  gulp.watch('source/scss/*.scss', ['build-css']);
  gulp.watch('source/js/**/*.js', ['build-js']);
  //gulp.watch('**/*.sass', ['sass']);
  gulp.watch('views/*.html', ['html-reload']);
  gulp.watch('routes/*.js', ['routes-reload']);
});