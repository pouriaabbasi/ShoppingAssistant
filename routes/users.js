const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (await User.findOne({ username: req.body.username }))
    return res.status(400).send("username is duplicate");

  if (await User.findOne({ email: req.body.email }))
    return res.status(400).send("email is duplicate");

  const salt = await bcrypt.genSalt(10);

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  });

  await user.save();

  res.send(user);
});

module.exports = router;
