import mongoose, { Document, Model, model } from "mongoose";
import Joi from "joi";
import _ from "lodash";
const joiObjectid = require("joi-objectid");
const objectId = joiObjectid(Joi);

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
  },
  description: {
    type: String,
    minlength: 3,
    maxlength: 500,
    trim: true,
  },
  categories: [
    {
      category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  brands: [
    {
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Brand",
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});
itemSchema.methods.toResult = function () {
  return _.pick(this, ["_id", "name", "description", "categories", "brands"]);
};

export interface IItemDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  categories: Array<{ category: mongoose.Schema.Types.ObjectId; name: string }>;
  brands: Array<{ brand: mongoose.Schema.Types.ObjectId; name: string }>;
  toResult(): any;
}

export const Item: Model<IItemDocument> = model<IItemDocument>(
  "Item",
  itemSchema
);

export function validateItem(item: any) {
  return Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(500),
    categories: Joi.array().items(objectId()),
    brands: Joi.array().items(objectId()),
  }).validate(item);
}
