require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');

const app = express();

const userRoutes = require('./routes/user'); 
const sauceRoutes = require('./routes/sauces');

mongoose.connect(process.env.DB_CONNECT,
    {   useNewUrlParser : true,
        useUnifiedTopology : true})
    .then(() => console.log("connexion à MongoDB réussi !"))
    .catch(() => console.log("connexion à MongoDB échouée !"));

app.use(express.json());

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;