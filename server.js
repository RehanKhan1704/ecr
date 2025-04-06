const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const connection = mysql.createConnection({
  host: 'database-1.cl8iuecq2cav.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin1234',
  database: 'dbform'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Create table if not exists
connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
  )
`, (err) => {
  if (err) throw err;
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  connection.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
    if (err) throw err;
    res.send('Data submitted successfully!');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
