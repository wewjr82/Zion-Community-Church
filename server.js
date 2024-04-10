const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define routes and CRUD operations here

// Test route to render a simple EJS template
// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Zion Community Church" });
});

app.post("/signup", (req, res) => {
  const { first_name, last_name, email, phone_number } = req.body;
  pool
    .query(
      "INSERT INTO members (first_name, last_name, email, phone_number ) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, email, phone_number]
    )
    .then(() => {
      console.log("Info has been added:", first_name, last_name);
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
