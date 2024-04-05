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
app.get('/test', (req, res) => {
  // Sample data to pass to the EJS template
  const data = {
    title: 'Test Page',
    message: 'This is a test page rendered with EJS!',
    items: ['item1', 'item2', 'item3']
  };
  
  // Render the EJS template and pass data to it
  res.render('test', data);
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
