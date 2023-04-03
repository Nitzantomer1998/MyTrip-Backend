const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/api"),
  (req, res) => {
    console.log("Here");
  };

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Here you can add your own authentication logic.
  // For example, you can query a database to see if the email and password match a user record.

  if (email === "example@gmail.com" && password === "password123") {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// Define the API endpoint for handling sign-up submissions
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  // Perform any necessary validation on the form data
  // ...

  // If the form data is valid, save the user to the database
  // ...

  // Return a response indicating success or failure
  res.json({ success: true });
});

app.listen(5000, () => {
  console.log("Server start at port 5000");
});
