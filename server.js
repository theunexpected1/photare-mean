/**
 * Base setup
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Mongo DB Connection
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/photare'); // connect to our database
mongoose.connection.on("open", function(){
	console.log("Connected to Photare database");
});

// Models
var Photo = require('./app/models/photo.js');


/**
 * Routes
 */
var router = express.Router();

// Middleware for routes
router.use(function(req, res, next){
	console.log("New API request");
	next();
});

// First route
router.get('/', function(req, res){
	res.json({message: 'Welcome to Photare'});
});

router.route('/photos')
	// Create a photo
	.post(function(req, res){
		var photo = new Photo();
		photo.title = req.body.title;
		photo.image = "";
		photo.url = "http://rahul.local:8080/api/photos/1";

		photo.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: "Photo created!"});
		});
		
	});


// Define api endpoint
app.use('/api', router);


/**
 * Start the server
 */

app.listen(port);
console.log("Listening...");