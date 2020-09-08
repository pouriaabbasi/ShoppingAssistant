import express from "express";
const app = express();

require("./startup/apiConfig")(app);
require("./startup/dbConfig")();

app.listen(3000, () => {
  console.log("app is ready and listening to the port 3000...");
});
