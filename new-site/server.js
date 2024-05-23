// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3

const app = express();
const PORT = process.env.PORT || 3000; // Define PORT variable

// Middleware
app.use(bodyParser.json());

// Define routes
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profiles', profileRoutes);

// Enable CORS middleware
const cors = require('cors');
app.use(cors());

// Define a route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    // Define SQLite database connection
    const db = new sqlite3.Database('users.db', err => {
        if (err) {
            console.error('Error opening database:', err);
        } else {
            console.log('Connected to SQLite database');
        }
    });
});

// Example fetch request in React component
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching data:', error));
