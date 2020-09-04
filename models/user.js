const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const _ = require("lodash");

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
userSchema.methods.toResult = function () {
  return _.pick(this, ["_id", "first_name", "last_name", "username", "email"]);
};

const User = mongoose.model("User", userSchema);

function validateCreate(user) {
  return new Joi.object({
    _id: Joi.objectId(),
    first_name: Joi.string().min(3).max(100).required(),
    last_name: Joi.string().min(3).max(100),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(6).max(100).email().required(),
    password: Joi.string().min(1).max(256).required(),
  }).validate(user);
}
function validateUpdate(user) {
  return new Joi.object({
    first_name: Joi.string().min(3).max(100).required(),
    last_name: Joi.string().min(3).max(100),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(6).max(100).email().required(),
  }).validate(user);
}
function validateChangePassword(user) {
  return new Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(1).max(256).required(),
    confirm_password: Joi.string().min(1).max(256).required(),
  }).validate(user);
}

module.exports.User = User;
module.exports.validateCreate = validateCreate;
module.exports.validateUpdate = validateUpdate;
module.exports.validateChangePassword = validateChangePassword;
