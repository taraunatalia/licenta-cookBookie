const multer = require('multer');
const storage = multer.memoryStorage();
 
const upload = multer({ storage: storage });

const controller = require('../controllers/recipe.controller');
const {verifyToken} =require('../middleware/verifyAuth');
const {isAdmin}=require('../middleware/verifyAuth');
const {ValidateNewRecipe} = require('../middleware/inputValidation');


module.exports=(app)=>{
    app.use('/recipe', [verifyToken]);
    app.use('/recipes', [verifyToken]);

    app.get('/recipes/public', controller.getAllPublicRecipes);
    app.get('/recipes/user', controller.getAllUserRecipes);

    app.get('/recipe/:id', controller.getRecipe);
	app.post('/recipe',upload.single('imageCover'), [ValidateNewRecipe], controller.createRecipe);
    app.patch('/recipe', [ValidateNewRecipe], controller.updateRecipe);
    app.delete('/recipe/user', controller.deleteMyRecipe);

    app.post('/recipe/try', controller.tryRecipe);
    app.get('/recipes/try', controller.getPreferRecipe);
    app.delete('/recipe/try', controller.removePreferRecipe);

    //admin
    app.get('/recipes', [isAdmin], controller.getAllRecipes);
    app.delete('/recipe', [isAdmin], controller.deleteRecipe);
    
}