const db = require('../config/db');

const saveContact = (data, callback) => {
    const query = 'INSERT INTO contacts (first_name, last_name, email, message) VALUES (?, ?, ?, ?)';
    db.query(query, [data.firstName, data.lastName, data.email, data.message], callback);
};

module.exports = { saveContact };
