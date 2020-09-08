import mongoose, { Document, Model, model } from "mongoose";
import _ from "lodash";
import jsonwebtoken from "jsonwebtoken";
import Joi, { ValidationResult } from "joi";

const userSchema = new mongoose.Schema({
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
userSchema.statics.decode = function (token: string | undefined) {
  if (!token) return null;
  const result = jsonwebtoken.decode(token.replace("Bearer ", ""));
  return _.pick(result, ["_id"]);
};
userSchema.methods.toResult = function () {
  return _.pick(this, ["_id", "first_name", "last_name", "username", "email"]);
};
userSchema.methods.createJwtToken = function () {
  return jsonwebtoken.sign({ _id: this._id }, "123123123");
};

export interface IUserDocument extends Document {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  toResult: () => any;
  createToken: () => any;
}
export interface IUserModel extends Model<IUserDocument> {
  decode: (
    token: string | undefined
  ) => { _id: mongoose.Schema.Types.ObjectId };
}

export const User: IUserModel = model<IUserDocument, IUserModel>(
  "User",
  userSchema
);

export function validateCreate(user: any): ValidationResult {
  return Joi.object({
    first_name: Joi.string().min(3).max(100).required(),
    last_name: Joi.string().min(3).max(100),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(6).max(100).email().required(),
    password: Joi.string().min(1).max(256).required(),
  }).validate(user);
}
export function validateUpdate(user: any): ValidationResult {
  return Joi.object({
    first_name: Joi.string().min(3).max(100).required(),
    last_name: Joi.string().min(3).max(100),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(6).max(100).email().required(),
  }).validate(user);
}
export function validateChangePassword(user: any): ValidationResult {
  return Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(1).max(256).required(),
    confirm_password: Joi.string().min(1).max(256).required(),
  }).validate(user);
}
