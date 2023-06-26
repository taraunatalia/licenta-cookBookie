const validateUser = require('../validation/user.validation');
const validateRecipe = require('../validation/recipe.validation');
const validateRating = require('../validation/rating.validation');

const ValidateNewUser = (req, res, next)=>{
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,

    };

    const { error } = validateUser(user);
    if(error){
        res.status(400).send({ message: error.details?.map((d)=> d?.message)});
        return;
    }
    next();
}

const ValidateNewRecipe = (req, res, next)=>{
    const recipe = {
        name: req.body.name,
        category: req.body.category,
        servings: req.body.servings,
        ingredients: req.body.ingredients,
        cookingTime: req.body.cookingTime,
        difficulty: req.body.difficulty,
        description: req.body.description,
        private: req.body.private

    };

    const { error } = validateRecipe(recipe);
    if(error){
        res.status(400).send({ message: error.details?.map((d)=> d?.message)});
        return;
    }
    next();
}

const validateNewRating = (req, res, next) => {
	const rating = {
		recipe: req.body.recipe,
		rating: req.body.rating,
	};
	const { error } = validateRating(rating);
	if (error) {
		res.status(400).send({ message: error?.details.map((d) => d?.message) });
		return;
	}
	next();
};


module.exports = {
    ValidateNewUser,
    ValidateNewRecipe,
    validateNewRating
}