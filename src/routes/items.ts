import express from "express";
import _ from "lodash";
import mongoose from "mongoose";
import auth from "../middlewares/auth";
import { User } from "../models/user";
import { Item, validateItem } from "../models/item";
import { Category } from "../models/category";
import { Brand } from "../models/brand";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));
  const items = await Item.find({ user: user._id });

  return res.send(_.map(items, (item) => item.toResult()));
});

router.get("/:id", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));
  const item = await Item.findOne({ _id: req.params.id, user: user._id });
  if (!item) return res.status(404).send("Item is not valid");

  return res.send(item.toResult());
});

router.post("/", auth, async (req, res) => {
  const { body: model } = req;
  const { error } = validateItem(model);
  if (error) return res.status(400).send(error.message);
  const user = User.decode(req.header("authorization"));

  const item = new Item({
    user: user._id,
    name: model.name,
    description: model.description,
    categories: [],
    brands: [],
  });

  const categories: Array<mongoose.Schema.Types.ObjectId> = model.categories;
  const brands: Array<mongoose.Schema.Types.ObjectId> = model.brands;
  if (categories)
    for (let index = 0; index < categories.length; index++) {
      const categoryId = categories[index];
      if (item.categories.find((x) => x.category == categoryId)) continue;
      const category = await Category.findById(categoryId);
      if (!category) return res.status(404).send("Category is not valid");
      item.categories.push({
        category: category._id,
        name: category.name,
      });
    }
  if (brands)
    for (let index = 0; index < brands.length; index++) {
      const brandId = brands[index];
      if (item.brands.find((x) => x.brand == brandId)) continue;
      const brand = await Brand.findById(brandId);
      if (!brand) return res.status(404).send("Brand is not valid");
      item.brands.push({
        brand: brand._id,
        name: brand.name,
      });
    }

  await item.save();
  return res.send(item.toResult());
});

router.put("/:id", auth, async (req, res) => {
  const { body: model } = req;
  const { error } = validateItem(model);
  if (error) return res.status(400).send(error.message);
  const user = User.decode(req.header("authorization"));

  const item = await Item.findOne({ _id: req.params.id, user: user._id });
  if (!item) return res.status(404).send("Item is not valid");

  item.name = model.name;
  item.description = model.description;
  item.brands = [];
  item.categories = [];

  const categories: Array<mongoose.Schema.Types.ObjectId> = model.categories;
  const brands: Array<mongoose.Schema.Types.ObjectId> = model.brands;
  if (categories)
    for (let index = 0; index < categories.length; index++) {
      const categoryId = categories[index];
      if (item.categories.find((x) => x.category == categoryId)) continue;
      const category = await Category.findById(categoryId);
      if (!category) return res.status(404).send("Category is not valid");
      item.categories.push({
        category: category._id,
        name: category.name,
      });
    }
  if (brands)
    for (let index = 0; index < brands.length; index++) {
      const brandId = brands[index];
      if (item.brands.find((x) => x.brand == brandId)) continue;
      const brand = await Brand.findById(brandId);
      if (!brand) return res.status(404).send("Brand is not valid");
      item.brands.push({
        brand: brand._id,
        name: brand.name,
      });
    }

  await item.save();
  return res.send(item.toResult());
});

router.delete("/:id", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));
  const item = await Item.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });
  if (!item) return res.status(404).send("item is not valid");

  return res.send(item.toResult());
});

export default router;
