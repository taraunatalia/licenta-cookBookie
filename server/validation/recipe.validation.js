const Joi = require('joi');

function validateRecipe(recipe){
    const schema = Joi.object({
        name: Joi.string().required(),
        rating: Joi.number(),
        category: Joi.string().valid('Aperitive', 'Ciorbe si Supa', 'Feluri principale', 'Deserturi').required(),
        servings: Joi.number(),
        ingredients: Joi.string().required(),
        cookingTime:Joi.string().required(),
        difficulty: Joi.string().valid('usor', 'mediu', 'dificil').required(),
        description: Joi.string().required().min(20).max(500),
        private: Joi.boolean().required()
      
    });
    return schema.validate(recipe);
}

module.exports= validateRecipe;
