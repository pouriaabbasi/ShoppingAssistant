import mongoose, { Document, Model, model } from "mongoose";
import Joi, { ValidationResult } from "joi";
import _ from "lodash";

const storeSchema = new mongoose.Schema({
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

export interface IStoreDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  address: string;
  description: string;
  toResult: () => any;
}

export const Store: Model<IStoreDocument> = model<IStoreDocument>(
  "Store",
  storeSchema
);

export function validateStore(store: any): ValidationResult {
  return Joi.object({
    name: Joi.string().min(3).max(100).required(),
    address: Joi.string().min(10).max(500),
    description: Joi.string().min(3).max(500),
  }).validate(store);
}
