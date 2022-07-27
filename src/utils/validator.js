const Joi = require('joi')

const isValid = function (object) {
    return Object.keys(object).length > 0;
};
  
const authorschema = Joi.object({
    title: Joi.string().required().valid("Mr", "Mrs", "Miss"),
    fname: Joi.string().min(3).required().trim(),
    lname: Joi.string().min(3).required().trim(),
    email: Joi.string().required().email().lowercase().trim(),
    password: Joi.string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,15}$/))
    .required(),
});

const blogchema = Joi.object({
  title: Joi.string().min(3).required().trim(),
  body: Joi.string().min(3).required().trim(),
  authorId: Joi.string().hex().length(24).required(),
  tags: Joi.array().items(Joi.string().min(3).trim()),
  category: Joi.string().min(3).required().trim(),
  subcategory: Joi.array().items(Joi.string().min(3).required().trim()),
  createdAt: Joi.date().timestamp(),
  updatedAt: Joi.date().timestamp(),
  deletedAt: Joi.date().timestamp(),
  isDeleted: Joi.boolean().default(false),
  publishedAt: Joi.date().max("2022-01-01").required(),
  ispublished: Joi.boolean().default(false),
});

module.exports =  { isValid, authorschema, blogchema }
