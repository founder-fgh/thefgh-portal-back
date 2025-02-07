require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Database Connection (using environment variables)
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',  // Use DB_HOST environment variable
    user: process.env.DB_USER || 'root',      // Use DB_USER environment variable
    password: process.env.DB_PASSWORD || '',  // Use DB_PASSWORD environment variable
    database: process.env.DB_NAME || 'contact_us', // Use DB_NAME environment variable
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL database.');
    }
});

// Create Table if Not Exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    thoughts TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Contacts table ready.');
    }
});

// API Route to Handle Form Submissions
app.post('/submit-form', (req, res) => {
    const { firstName, lastName, email, thoughts } = req.body;

    if (!firstName || !lastName || !email || !thoughts) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const insertQuery = `
    INSERT INTO contacts (first_name, last_name, email, thoughts)
    VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [firstName, lastName, email, thoughts], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        res.status(200).json({ message: 'Form submitted successfully.' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
