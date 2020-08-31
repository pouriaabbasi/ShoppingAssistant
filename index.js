const express = require("express");
const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("app is ready and listening to the port 3000...");
});
