const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// const cport = parseInt(process.env.DB_PORT, 10);

// pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: cport,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_PRIVATE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log(process.env.DATABASE_URL);

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

app.post("/signup", (req, res, next) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    phone_number,
    date_joined,
    title,
  } = req.body;
  pool.query(
    "INSERT INTO members (first_name, last_name, date_of_birth, phone_number, date_joined, title ) VALUES ($1, $2, $3, $4, $5, $6)",
    [first_name, last_name, date_of_birth, phone_number, date_joined, title],
    (error) => {
      if (error) {
        console.error("Error executing query", error);
        return res.status(500).send("Internal Server Error");
      }
      console.log("New member has been added:", first_name, last_name);
      res.redirect("/members");
    }
  );
});

app.get("/members", (req, res, next) => {
  pool.query("SELECT * FROM members", (error, result) => {
    if (error) {
      console.error("Error executing query", error);
      return res.status(500).send("Internal Server Error");
    }
    res.render("members", { members: result.rows });
  });
});

app.post("/delete/:id", (req, res, next) => {
  const id = req.params.id;
  pool.query("DELETE FROM members WHERE id = $1", [id], (error) => {
    if (error) {
      console.error("Error executing query", error);
      return res.status(500).send("Internal Server Error");
    }
    console.log("Member has been deleted");
    res.redirect("/");
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
