const express = require('express');
const router = express.Router();
const { saveContact } = require('../models/contactModel');

// Handle contact form submission
router.post('/', (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const data = { firstName, lastName, email, message };
    saveContact(data, (err, result) => {
        if (err) {
            console.error('Error saving contact:', err);
            return res.status(500).json({ error: 'Failed to save contact.' });
        }
        res.status(200).json({ message: 'Contact saved successfully!' });
    });
});

module.exports = router;
