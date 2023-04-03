const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send(JSON.stringify("<h3>Hi From Backend API</h3>"));
  return res;
});

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
