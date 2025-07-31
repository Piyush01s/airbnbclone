const Joi = require('joi');

const reviewSchema = Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5)
});

module.exports = { reviewSchema };

module.exports.listingSchema = {
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.array().items(
            Joi.object({
                filename: Joi.string().required(),
                url: Joi.string().required()
            })
        ).required()
    })
};
