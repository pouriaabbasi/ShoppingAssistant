const express = require("express");
const _ = require("lodash");

const { User } = require("../models/user");
const { Store, validateStore } = require("../models/store");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));

  const stores = await Store.find({ user: user._id });
  res.send(_.map(stores, (store) => store.toResult()));
});

router.get("/:id", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));

  const store = await Store.findOne({ _id: req.params.id, user: user._id });
  if (!store) return res.status(404).send("Store is not valid");

  res.send(store.toResult());
});

router.post("/", auth, async (req, res) => {
  const { body: model } = req;
  const { error } = await validateStore(model);
  if (error) return res.status(400).send(error.details[0].message);

  const user = User.decode(req.header("authorization"));
  const store = new Store({
    user: user._id,
    name: model.name,
    address: model.address,
    description: model.description,
  });

  await store.save();

  return res.send(store.toResult());
});

router.put("/:id", auth, async (req, res) => {
  const { body: model } = req;
  const { error } = await validateStore(model);
  if (error) return res.status(400).send(error.details[0].message);

  const user = User.decode(req.header("authorization"));
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id, user: user._id },
    {
      name: model.name,
      address: model.address,
      description: model.description,
    },
    { new: true }
  );
  if (!store) return res.status(404).send("Store is not valid");

  return res.send(store.toResult());
});

router.delete("/:id", auth, async (req, res) => {
  const user = User.decode(req.header("authorization"));

  const store = await Store.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });
  if (!store) return res.status(404).send("Store is not valid");

  return res.send(store.toResult());
});

module.exports = router;
