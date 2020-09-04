const express = require("express");
const _ = require("lodash");
const router = express.Router();
const bcrypt = require("bcrypt");

const {
  User,
  validateCreate,
  validateUpdate,
  validateChangePassword,
} = require("../models/user");
const auth = require("../middlewares/auth");

router.get("/", [auth], async (req, res) => {
  const users = await User.find();
  res.send(_.map(users, (user) => user.toResult()));
});

router.get("/:id", [auth], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).send("User id not valid");

  res.send(user.toResult());
});

router.post("/", [auth], async (req, res) => {
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

  res.send(user.toResult());
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (
    await User.findOne({
      username: req.body.username,
      _id: { $ne: req.params.id },
    })
  )
    return res.status(400).send("username is duplicate");

  if (
    await User.findOne({ email: req.body.email, _id: { $ne: req.params.id } })
  )
    return res.status(400).send("email is duplicate");

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
    },
    { new: true }
  );
  if (!user) return res.status(404).send("User is not valid");

  return res.send(user.toResult());
});

router.put("/update-password/:id", [auth], async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User is not vlaid");

  if (!(await bcrypt.compare(req.body.current_password, user.password)))
    return res.status(400).send("Current password is not valid");
  if (req.body.new_password !== req.body.confirm_password)
    return res
      .status(400)
      .send("New password nad confirm password is not matched");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.new_password, salt);

  await user.save();

  return res.send(user.toResult());
});

router.delete("/:id", [auth], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("User is not valid");

  return res.send(user.toResult());
});

module.exports = router;
