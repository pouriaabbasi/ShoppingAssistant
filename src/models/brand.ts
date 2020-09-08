import mongoose, { Document, model, Model } from "mongoose";
import Joi, { ValidationResult } from "joi";
import _ from "lodash";
import { IUserDocument } from "./user";

const modelSchema = new mongoose.Schema({
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

modelSchema.methods.toResult = function () {
  return _.pick(this, ["_id", "name"]);
};

export interface IBrandDocoment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  toResult: () => any;
}

export const Brand: Model<IBrandDocoment> = model<IBrandDocoment>(
  "Brand",
  modelSchema
);

export function validateBrand(brand: any): ValidationResult {
  return Joi.object({
    name: Joi.string().min(3).max(100).required(),
  }).validate(brand);
}
