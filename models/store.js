const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const storeSchema = mongoose.Schema({
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
  address: {
    type: String,
    minLength: 10,
    maxLength: 500,
    trim: true,
  },
  description: {
    type: String,
    minLength: 3,
    maxLength: 500,
    trim: true,
  },
});
storeSchema.methods.toResult = function () {
  return _.pick(this, ["_id", "name", "address", "description"]);
};

const Store = mongoose.model("Store", storeSchema);

function validate(store) {
  return new Joi.object({
    name: Joi.string().min(3).max(100).required(),
    address: Joi.string().min(10).max(500),
    description: Joi.string().min(3).max(500),
  }).validate(store);
}

module.exports.Store = Store;
module.exports.validateStore = validate;
