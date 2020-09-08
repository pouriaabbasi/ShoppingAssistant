import mongoose, { Document, Model, model } from "mongoose";
import Joi from "joi";
import _ from "lodash";

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
        ref: "Brand",
      },
      name: String,
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
