const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')


const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{label}} Must not include Html!'
    },
    rules: {
        escapeHTML : {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: []  ,      //This[] means that nothing is ALLOWED ex no h1, h2 or script in the website
                    allowedAttributes: {},
                });
               if(clean !== value) return helpers.error('string.escapeHTML', { value })
               return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consectetur atque, incidunt obcaecati pariatur totam ex quisquam corrupti vero nobis. Totam est error modi laudantium placeat rerum harum! Illo, corrupti!