import express from "express";
import auth from "../routes/auth";
import brands from "../routes/brands";
import stores from "../routes/stores";
import categories from "../routes/categories";
import items from "../routes/items";

// import users from "../routes/users";

module.exports = function (app: express.Application) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/brands", brands);
  app.use("/api/stores", stores);
  app.use("/api/categories", categories);
  app.use("/api/items", items);

  // app.use("/api/admin/users", users);
};
