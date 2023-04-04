import express from "express";

const PORT = process.env.port || 3001;
const APP = express();

APP.get("/", (req, res) => {
  console.log("A new request has arrived to index.js");
  res.send("Hello from the server main page");
});

APP.listen(PORT, () => {
  console.log(`server is up and running at port --> ${PORT}`);
});
