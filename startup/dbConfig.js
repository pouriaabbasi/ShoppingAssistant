const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(
      "mongodb+srv://pouria:nano-npag-123@pouriacluster.mnrra.mongodb.net/test?authSource=admin&replicaSet=atlas-v0iukc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      }
    )
    .then(() => {
      console.log("Connected to the database...");
    })
    .catch((err) => {
      console.log("An error occured!", err);
    });
};
