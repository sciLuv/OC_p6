//Express, framework NodeJS permettant de creer un serveur rapidement.
const express = require('express');
//mongoose est un package qui nous permet de communiquer avec mongoDB, notre base de donnée 
const mongoose = require('mongoose');
//Package permettant d'éviter les différentes erreurs en rapport avec les sécurités HTTP CORS.
const cors = require('cors');
//Package qui permet de limiter les requetes à une api pour éviter la surcharge de serveur.
const rateLimit = require('express-rate-limit');
//Package qui permet d'augmenter la sécurité de nos header de requete http retourner pas express
const helmet = require("helmet");

//Package interne nodeJS permettant de travailler avec les chemins des fichiers et répertoires.
const path = require('path');

//Appel d'express sous la constante app.
const app = express();

//mise en place d'helmet avec la modification de la regle qui bloque les requete d'origine différentes
app.use(helmet(
    { crossOriginResourcePolicy: { policy: "same-site" } }
));

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

//mise en place des regle de limitation de requete par IP
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limiter chaque IP à 100 requêtes par `window` (ici, par 15 minutes )
	standardHeaders: true, // Renvoie les informations de limite de débit dans les en-têtes `RateLimit-*`
	legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*` 
})

// Applique le middleware de limitation de débit à toutes les requêtes
app.use(limiter);

//rend les images accessibles pour toutes les requêtes vers la route associé aux images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Complete l'URI des routes des fichiers précédemment appeler et d'acceder à l'ensemble de leurs fonctionnalité
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//Pour exporter express et l'ensemble des logiques qui lui sont lié dans le fichier server.
module.exports = app;


