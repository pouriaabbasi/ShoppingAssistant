import mongoose, { Document, Model, model } from "mongoose";
import Joi from "joi";
import _ from "lodash";
const joiObjectId = require("joi-objectid");

const objectId = joiObjectId(Joi);

const categorySchema = new mongoose.Schema({
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
categorySchema.methods.toResult = function () {
  return _.pick(this, ["_id", "name", "brands"]);
};

export interface ICategoryDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  brands: Array<{ brand: mongoose.Schema.Types.ObjectId; name: string }>;
  toResult: () => any;
}

export const Category: Model<ICategoryDocument> = model<ICategoryDocument>(
  "Category",
  categorySchema
);

export function validateCategory(category: any) {
  return Joi.object({
    name: Joi.string().min(3).max(100).required(),
    brands: Joi.array().items(objectId().required()),
  }).validate(category);
}
