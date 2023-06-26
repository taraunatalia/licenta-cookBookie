const db = require('../models');

const Rating = db.rating;
const User = db.user;
const Recipe = db.recipe;

const calculateAverageAndUpdate = async (recipe) => {
	const recipeRatings = await Rating.find({ recipe: recipe._id }).exec();
	const total = recipeRatings.map((br) => br.rating).reduce((acc, curr) => acc + curr);
	const avg = total / recipeRatings.length;

	recipe.rating = avg;
	await recipe.save();
};

exports.getRatings = async (req, res) => {
	try {
		const ratings = await Rating.find({ recipe: req.params.id }).exec();
		res.send({
			ratings: ratings.map((r) => ({
				rating: r.rating,
				currentUser: r.user.toString() === req.userId,
			})),
		});
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.addRating = async (req, res) => {
	try {
		const rating = await Rating.findOne({ user: req.userId, recipe: req.body.recipe }).exec();
		if (rating) {
			res.status(400).send({ message: 'Ai evaluat deja această rețetă!' });
			return;
		}
        const user = await User.findById(req.userId).exec();
		const recipe = await Recipe.findById(req.body.recipe).exec();

		const newRating = {
			user: user._id,
			recipe: recipe._id,
			rating: req.body.rating,
		};
        await new Rating(newRating).save();
		res.send({ message: 'Rating adăugat!' });
        await calculateAverageAndUpdate(recipe);
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.updateRating = async (req, res) => {
	try {
		const rating = await Rating.findOneAndUpdate({ user: req.userId, recipe: req.body.recipe }, {
			rating: req.body.rating,
		}).exec();
		if (!rating) {
			res.status(400).send({ message: 'Rating must exist before updating' });
			return;
		}
		const recipe = await Recipe.findById(req.body.recipe).exec();
		await calculateAverageAndUpdate(recipe);
		res.send({ message: 'Updated rating' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.deleteRating = async (userId) => {
	const ratings = await Rating.find({ user: userId });
	await Rating.deleteMany({ user: userId }).exec();
	if (ratings) {
		await Promise.all(ratings.map(async (rating) => {
			const recipe = await Recipe.findById(rating.recipe).exec();
			return calculateAverageAndUpdate(recipe);
		}));
	}
};
