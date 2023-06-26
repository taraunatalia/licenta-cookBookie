const mongoose = require('mongoose');

const Rating = mongoose.model(
	'Rating',
	new mongoose.Schema({
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		recipe: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Recipe',
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
	}),
);

module.exports = Rating;