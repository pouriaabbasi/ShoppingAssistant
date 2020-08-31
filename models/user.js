const mongoose = require("mongoose");

const User = mongoose.Schema({
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
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 256,
    trim: true,
  },
});

module.exports.User = User;
