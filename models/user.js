const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
    trim: true,
  },
  last_name: {
    type: String,
    minLength: 3,
    maxLength: 100,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 256,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

function validate(user) {
  const userSchema = new Joi.object({
    _id: Joi.objectId(),
    first_name: Joi.string().min(3).max(100).required(),
    last_name: Joi.string().min(3).max(100),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(6).max(100).email().required(),
    password: Joi.string().min(1).max(256).required(),
  });

  return userSchema.validate(user);
}

module.exports.User = User;
module.exports.validate = validate;
