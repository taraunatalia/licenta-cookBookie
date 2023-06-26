const controller = require('../controllers/rating.controller');
const { verifyToken } = require('../middleware/verifyAuth');
const { inputValidation } = require('../middleware');

module.exports = (app) => {
	// token middleware
	app.use('/rating', verifyToken);
	app.use('/ratings', verifyToken);

	// routes
	app.get('/ratings/:id', controller.getRatings);

	app.post('/rating', [inputValidation.validateNewRating], controller.addRating);

	app.patch('/rating', [inputValidation.validateNewRating], controller.updateRating);

	// app.delete('/rating', controller.deleteRating);
};
