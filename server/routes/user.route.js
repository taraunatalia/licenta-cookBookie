const userController = require('../controllers/user.controller');

const checkDuplicateEmail=require('../middleware/verifySignup');
const {verifyToken} =require('../middleware/verifyAuth');
//const isAdmin=require('../middleware/verifyAuth');

module.exports = (app) => {
	// token middleware
	app.use('/user', [verifyToken]);
    //app.use('/admin', [verifyToken, isAdmin]);

	// user routes

	app.get('/user', userController.getProfile);

	app.patch('/user', userController.updateProfile);

	app.delete('/user', userController.deleteProfile);

    //admin routes

    //app.get('/admin/users', userController.getAllUsers);

	//app.post('/admin/user', [inputValidation.validateNewUser], userController.createUser);

	//app.patch('/admin/user', [checkDuplicateEmail], userController.updateUser);

	//app.delete('/admin/user', userController.deleteUser);
};