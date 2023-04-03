const express = require("express");
const cors = require("cors");

const PORT = 3001;
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  console.log("Hey");
});

app.get("/api"),
  (req, res) => {
    console.log("Here");
  };

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "example@gmail.com" && password === "password123") {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
