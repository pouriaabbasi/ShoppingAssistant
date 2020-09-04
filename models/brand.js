const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const { func } = require("joi");

const brandSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
    trim: true,
  },
});
brandSchema.methods.toResult = function () {
  return _.pick(this, ["_id", "name"]);
};

const Brand = mongoose.model("Brand", brandSchema);

function validate(brand) {
  return new Joi.object({
    name: Joi.string().min(3).max(100).required(),
  }).validate(brand);
}

module.exports.Brand = Brand;
module.exports.validateBrand = validate;
