//Ensemble des routes et requete qui sont en rapport avec la création de compte et le login

const express = require('express');

//appel de la methode router d'express pour les prochaines route en rapport avec la gestion des utilisateurs
const router = express.Router();

//userCtrl contient l'ensemble des regles a executer en fonction de la requete et de l'evenement lié.
const userCtrl = require('../controllers/user');

//Post pour la création d'un nouvel utilisateur
router.post('/signup', userCtrl.signup);
//Post pour la connexion d'un nouvel utilisateur
router.post('/login', userCtrl.login);

module.exports = router;