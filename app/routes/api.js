module.exports = function(app, express){
	// Models
	var Photo = require('../models/photo.js');
	// Router
	var apiRouter = express.Router();

	// Middleware for routes
	apiRouter.use(function(req, res, next){
		console.log("New API request");
		next();
	});

	// First route
	apiRouter.get('/', function(req, res){
		res.json({message: 'Welcome to Photare'});
	});

	// Routes that end in /photos
	apiRouter.route('/photos')
		// Create a photo
		.post(function(req, res){
			var photo = new Photo();
			photo.title = req.body.title;
			photo.image = "";
			photo.url = req.body.url || "http://rahul.local:8080/api/photos/1";
			photo.shortUrl = req.body.shortUrl || "http://rahul.local:8080/api/photos/1/short";

			photo.save(function(err){
				if(err){
					res.send(err);
				}
				res.json({message: "Photo created!"});
			});
			
		})
		// Get all photos 
		.get(function(req, res){
			Photo.find(function(err, photos){
				if(err){
					res.send(err);
				}
				res.json(photos);
			});
		});

	// Routes that end in /photos/:photo_id
	apiRouter.route('/photos/:photo_id')
		.get(function(req, res){
			Photo.findById(req.params.photo_id, function(err, photo){
				if(err){
					res.send(err);
				}
				res.json(photo);
			});
		})

		// Update a photo
		.put(function(req, res){
			Photo.findById(req.params.photo_id, function(err, photo){
				if(err){
					res.send(err);
				}
				if(photo){
					photo.title = req.body.title;
					photo.save(function(err){
						if(err){
							res.send(err);
						}
						res.json({message: "Photo title changed to " + req.body.title});
					});
				} else{
					res.json({message: "Photo does not exist"});
				}
			});
		})

		// Delete a photo
		.delete(function(req, res){
			Photo.remove({
				_id: req.params.photo_id
			}, function(err, photo){
				if(err){
					res.send(err);
				}
				if(photo){
					res.json({message: "Photo deleted", params: req.params});
				} else{
					res.json({message: "Photo does not exist"});
				}
			});
		});

	return apiRouter;
};
