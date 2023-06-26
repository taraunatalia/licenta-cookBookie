const controller = require('../controllers/auth.controller');
const {ValidateNewUser}= require('../middleware/inputValidation');
const checkDuplicateEmail=require('../middleware/verifySignup');


module.exports=(app)=>{
    app.use((req, res, next)=>{
        res.header(
            'Access-Control-Allow-Headers',
            'Authorization, Origin, Content-Type, Accept'
        );
        next();
    });

   app.post('/auth/signup', [ ValidateNewUser, checkDuplicateEmail], controller.signup);

    app.post('/auth/signin', controller.signin);
}