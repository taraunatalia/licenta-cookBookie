const { recipe } = require('../models');
const db = require('../models');
const Recipe = db.recipe;
const Rating = db.rating;
const User = db.user;
const fs = require('fs');
const path = require('path');

// user methods
exports.getAllPublicRecipes = async (req, res) => {
	try {
		const recipes = await Recipe.find({ private: false }).populate('user', 'name').exec();
		if (!recipes) {
			res.status(204).send({ message: 'There are no public recipes here!' });
			return;
		}
		res.status(200).send({ recipes });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};
exports.getAllUserRecipes = async (req, res) => {
	try {
		const userId = req.userId;
		const recipes = await Recipe.find({user: userId}).exec();
		if(recipes.length === 0){
			res.status(204).send({message: 'Nu există rețete postate de acest utilizator!'});
			return;
		}
		
		res.status(200).send({ recipes });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.getRecipe = async (req, res) => {
	const { id } = req.params;
	try {
		const recipe = await Recipe.findById(id).exec();
		res.send({ recipe });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};


exports.createRecipe = async (req, res) => {
	try {
		await new Recipe({
            name: req.body.name?.trim(),
            rating: req.body.rating?.trim(),
            category: req.body.category?.trim(),
            servings: req.body.servings,
            ingredients: req.body.ingredients?.trim(),
            cookingTime: req.body.cookingTime?.trim(),
            difficulty: req.body.difficulty?.trim(),
            description: req.body.description?.trim(),
            imageCover: req.file.filename,
            private: req.body.private,
			user: req.userId
                  
		}).save();
		res.send({ message: 'Recipe created successfully!' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.tryRecipe = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if(user.preferredRecipes.find(id => id == req.body.recipe)) {
			res.status(400).send({"message": "Recipe already added."});
			return;
		}
		const recipe = await Recipe.findById(req.body.recipe).populate('user');
		if(user._id == recipe.user._id) {
			res.status(400).send({"message": "You can't try your own recipe"});
			return;
		}
		user.preferredRecipes.push(recipe._id);
		user.save();
		res.status(200).send({"message": "Recipe added successfuly"});
	} catch (err) {
		res.status(500).send({ message: err });
	}
}

exports.removePreferRecipe = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		user.preferredRecipes = user.preferredRecipes.filter(id => id != req.body.id);
		await user.save();
		res.status(200).send({"message": "Recipe removed successfuly"});
	} catch (err) {
		res.status(500).send({ message: err });
	}
}
exports.getPreferRecipe = async (req, res) => {
	try {
		const user = await User.findById(req.userId).populate('preferredRecipes');
		res.send({recipes: user.preferredRecipes});
		} catch (err) {
		res.status(500).send({ message: err });
	}
}

exports.updateRecipe = async (req, res) => {
	try {
		const updatedRecipe = {
			name: req.body.name?.trim(),
            category: req.body.category?.trim(),
            servings: req.body.servings,
            ingredients: req.body.ingredients?.trim(),
            cookingTime: req.body.cookingTime?.trim(),
            difficulty: req.body.difficulty?.trim(),
            description: req.body.description?.trim(),
            imageCover: req.body.imageCover?.trim(),
            private: req.body.private
		};
		const recipe = await Recipe.findByIdAndUpdate(req.body._id, updatedRecipe).exec();
		if (!recipe) {
			res.status(400).send({ message: 'No recipe with the given id exists!' });
			return;
		}
		res.send({ message: 'Updated recipe successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: err });
	}
};

exports.deleteMyRecipe = async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.body.recipeId).populate('user');
		if(recipe.user._id != req.userId) {
			res.status(401).send({message: 'You can only delete your recipes'});
			return;
		}
		const session = await Recipe.startSession();
		await session.withTransaction(async () => {
			const deletedRecipe = await Recipe.findByIdAndDelete(req.body.recipeId).exec();
			if (deletedRecipe) {
				await Rating.deleteMany({ recipe: req.body.recipeId }).exec();
			}
		});
		session.endSession();
		res.send({ message: 'Recipe deleted successfully!' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

// admin methods
exports.getAllRecipes = async (req, res) => {
	try {
		const recipes = await Recipe.find().populate('user', 'name').exec();
		res.status(200).send({ recipes });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};
exports.deleteRecipe = async (req, res) => {
	try {
		const session = await Recipe.startSession();
		await session.withTransaction(async () => {
			const deletedRecipe = await Recipe.findByIdAndDelete(req.body.recipeId).exec();
			if (deletedRecipe) {
				await Rating.deleteMany({ recipe: req.body.recipeId }).exec();
			}
		});
		session.endSession();
		res.send({ message: 'Recipe deleted successfully!' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

