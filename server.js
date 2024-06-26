const express = require("express");
const pool = require("./db");
// const { Pool } = require("pg");
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

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define routes and CRUD operations here
// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Zion Community Church" });
});

app.get("/visitors", (req, res) => {
  res.render("visitors");
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
    .catch((error) => {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  pool
    .query("SELECT * FROM members WHERE id = $1", [id])
    .then((result) => {
      res.render("edit", { member: result.rows[0] });
    })
    .catch((error) => {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/update/:id", (req, res) => {
  const id = req.params.id;
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
      "UPDATE members SET first_name = $1, last_name = $2, date_of_birth = $3, phone_number = $4, date_joined = $5, title = $6 WHERE id = $7",
      [
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        date_joined,
        title,
        id,
      ]
    )
    .then(() => {
      console.log("Member has been updated");
      res.redirect("/members");
    })
    .catch((error) => {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
    });
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
