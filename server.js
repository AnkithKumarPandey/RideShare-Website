const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ankith@123',
    database: 'rideshare'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Route to post a ride
app.post('/api/rides', (req, res) => {
    const { startLocation, endLocation, date, price, phoneNumber } = req.body;
    const query = 'INSERT INTO rides (startLocation, endLocation, date, price, phoneNumber) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [startLocation, endLocation, date, price, phoneNumber], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to post ride' });
        }
        res.status(201).json({ id: result.insertId, startLocation, endLocation, date, price, phoneNumber });
    });
});

// Route to get all rides
app.get('/api/rides', (req, res) => {
    db.query('SELECT * FROM rides', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve rides' });
        }
        res.json(results);
    });
});

// Route to book a ride and remove it from the database
app.delete('/api/rides/:id', (req, res) => {
    const rideId = req.params.id;
    const query = 'DELETE FROM rides WHERE id = ?';

    db.query(query, [rideId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to book ride' });
        }
        res.status(204).send();
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
