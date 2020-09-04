const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User, validateCreate } = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = validateCreate(req.body);
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

  setAuthorizationHeader(user, res);
  return res.send(user.toResult());
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(404).send("username or password is not valid");

  if (!(await bcrypt.compare(req.body.password, user.password)))
    return res.status(404).send("username or password is not valid");

  setAuthorizationHeader(user, res);
  return res.send(user.toResult());
});

function validateLogin(login) {
  return new Joi.object({
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(3).max(100).required(),
  }).validate(login);
}

function setAuthorizationHeader(user, res) {
  res.header("authorization", `Bearer ${user.createJwtToken()}`);
}

module.exports = router;
