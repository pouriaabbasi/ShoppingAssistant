const express = require("express");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const { User } = require("../models/user");
const { Brand, validateBrand } = require("../models/brand");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));

  const brands = await Brand.find({ user: user._id });
  return res.send(_.map(brands, (brand) => brand.toResult()));
});

router.get("/:id", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));

  const brand = await Brand.findOne({ _id: req.params.id, user: user._id });
  if (!brand) return res.status(404).send("Brand is not valid");

  return res.send(brand.toResult());
});

router.post("/", auth, async function (req, res) {
  const { body: model } = req;
  const { error } = validateBrand(model);
  if (error) return res.status(400).send(error.details[0].message);

  const user = User.decode(req.header("authorization"));
  const brand = new Brand({
    user: user._id,
    name: model.name,
  });
  await brand.save();

  return res.send(brand.toResult());
});

router.put("/:id", auth, async function (req, res) {
  const { body: model } = req;
  const { error } = validateBrand(model);
  if (error) return res.status(400).send(error.details[0].message);

  const user = User.decode(req.header("authorization"));
  const brand = await Brand.findOneAndUpdate(
    { user: user._id, _id: req.params.id },
    {
      name: model.name,
    },
    { new: true }
  );
  if (!brand) return res.status(404).send("Brand is not valid");

  return res.send(brand.toResult());
});

router.delete("/:id", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));

  const brand = await Brand.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });
  if (!brand) return res.status(404).send("Brand is not valid");

  return res.send(brand.toResult());
});

module.exports = router;
