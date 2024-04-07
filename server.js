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
  pool
    .query("SELECT * FROM your_table")
    .then((result) => {
      res.render("index", { items: result.rows, title: "CRUD App" });
    })
    .catch((error) => res.status(500).send("Internal Server Error"));
});

app.post("/create", (req, res) => {
  const { name, description } = req.body;
  pool
    .query("INSERT INTO your_table (name, description) VALUES ($1, $2)", [
      name,
      description,
    ])
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM your_table WHERE id = $1", [id])
    .then((result) => {
      res.render("edit", { item: result.rows[0] });
    })
    .catch((error) => {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  pool
    .query("UPDATE your_table SET name = $1, description = $2 WHERE id = $3", [
      name,
      description,
      id,
    ])
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  pool
    .query("DELETE FROM your_table WHERE id = $1", [id])
    .then(() => {
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
