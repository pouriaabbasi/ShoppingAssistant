import express from "express";
import _ from "lodash";
import auth from "../middlewares/auth";
import { Category } from "../models/category";
import { User } from "../models/user";
import { Brand } from "../models/brand";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));
  const categories = await Category.find({ user: user._id });
  return res.send(_.map(categories, (category) => category.toResult()));
});

router.get("/:id", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));
  const category = await Category.findOne({
    _id: req.params.id,
    user: user._id,
  });
  if (!category) return res.status(404).send("Category is not valid");
  return res.send(category.toResult());
});

router.post("/", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));
  const category = new Category({
    user: user._id,
    name: req.body.name,
    brands: [],
  });
  await category.save();
  const brands: Array<mongoose.Schema.Types.ObjectId> = req.body.brands;
  await brands.forEach(async (brand) => {
    const refBrand = await Brand.findById(brand);
    if (!refBrand) return res.status(404).send("Brand is not valid");
    category.brands.push({
      brand: refBrand._id,
      name: refBrand.name,
    });
    await category.save();
  });
  return res.send(category.toResult());
});

export default router;
