const Joi = require('joi');

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(8).required(),
    });
    return schema.validate(user);
}

module.exports=validateUser;
