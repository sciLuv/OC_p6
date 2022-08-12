//Porte d'entrer dans L'api et son fonctionnement
const express = require('express');
const mongoose = require('mongoose');

//Package permettant d'éviter les différentes erreurs en rapport avec les sécurités HTTP CORS.
const cors = require('cors');

//Package interne nodeJS permettant de travailler avec les chemins des fichiers et répertoires.
const path = require('path');


//Appel d'express sous la constante app.
const app = express();

//Deux constante représentant les fichiers routes des utilisateurs et des sauces 
const userRoutes = require('./routes/user'); 
const sauceRoutes = require('./routes/sauces');

//methode Mongoose permettant la connexion à la Base de Données 
mongoose.connect(process.env.DB_CONNECT,
    {   useNewUrlParser : true,
        useUnifiedTopology : true})
    .then(() => console.log("connexion à MongoDB réussi !"))
    .catch(() => console.log("connexion à MongoDB échouée !"));

//remplace anciennement body-parser, permet de formater les informations envoyées sous forme de JSON 
app.use(express.json());

//appel de la methode cors() du package appelé précédemment
app.use(cors());


//rend les images accessibles pour toutes les requêtes vers la route associé aux images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Complete l'URI des routes des fichiers précédemment appeler et d'acceder à l'ensemble de leurs fonctionnalité
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;