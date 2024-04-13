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
  const {
    first_name,
    last_name,
    date_of_birth,
    phone_number,
    date_joined,
    title,
  } = req.body;
  pool
    .query(
      "INSERT INTO members (first_name, last_name, date_of_birth, phone_number, date_joined, title ) VALUES ($1, $2, $3, $4, $5, $6)",
      [first_name, last_name, date_of_birth, phone_number, date_joined, title]
    )
    .then(() => {
      console.log("New member has been added:", first_name, last_name);
      res.redirect("/members");
    })
    .catch((error) => {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/members", (req, res) => {
  pool
    .query("SELECT * FROM members")
    .then((result) => {
      res.render("members", { members: result.rows });
    })
    .catch((error) => res.status(500).send("Internal Server Error"));
});

app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  pool
    .query("DELETE FROM members WHERE id = $1", [id])
    .then(() => {
      console.log("Member has been deleted");
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
