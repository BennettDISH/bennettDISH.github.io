const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Initialize SQLite database
const db_name = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    console.error('Database opening error: ' + err);
  } else {
    console.log('Database connected.');
  }
});

// Create table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS visitors (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       visit_time TEXT
     )`,
    (err) => {
      if (err) {
        console.error('Table creation error: ' + err);
      }
    }
  );
});

// Middleware to log visits
app.use((req, res, next) => {
  const visitTime = new Date().toISOString();
  db.run(
    `INSERT INTO visitors (visit_time) VALUES (?)`,
    [visitTime],
    (err) => {
      if (err) {
        console.error('Insert error: ' + err);
      }
    }
  );
  next();
});

// Route to display visitors
app.get('/', (req, res) => {
  db.all('SELECT * FROM visitors', [], (err, rows) => {
    if (err) {
      res.status(500).send('Database error: ' + err);
    } else {
      let html = '<h1>Visitors Log</h1><ul>';
      rows.forEach((row) => {
        html += `<li>ID: ${row.id}, Visit Time: ${row.visit_time}</li>`;
      });
      html += '</ul>';
      res.send(html);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
