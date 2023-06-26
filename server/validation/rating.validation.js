const Joi = require('joi');

function validateRating(rating) {
	const schema = Joi.object({
		recipe: Joi.string().required(),
		rating: Joi.number().min(1).max(5).required(),
	});
	return schema.validate(rating);
}

module.exports = validateRating;