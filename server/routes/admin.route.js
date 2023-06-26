const userController = require('../controllers/user.controller');
const recipeController = require('../controllers/recipe.controller');

//const checkDuplicateEmail=require('../middleware/verifySignup');
const {verifyToken} =require('../middleware/verifyAuth');
const {isAdmin}=require('../middleware/verifyAuth');
const {ValidateNewUser}= require('../middleware/inputValidation');

module.exports = (app) => {
	// token middleware
    app.use('/admin', [verifyToken, isAdmin]);
	app.use('/admin/recipe', [verifyToken, isAdmin]);

    //admin routes

    app.get('/admin', userController.getAllUsers);

	app.get('/admin/recipe', recipeController.getAllRecipes);

	app.post('/admin', [ValidateNewUser], userController.createUser);

	app.post('/admin/recipe', [ValidateNewUser], recipeController.createRecipe);

	app.delete('/admin', userController.deleteUser);

	app.delete('/admin/recipe', recipeController.deleteRecipe);

	app.get('/admin/check', [verifyToken, isAdmin], (req, res) => res.send());

};