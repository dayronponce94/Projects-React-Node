require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/appointments', require('./routes/appointments'));
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/users', require('./routes/users'));

app.get('/api/test', (req, res) => {
    res.json({ message: '¡Backend is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server flying on port ${PORT}`);
});