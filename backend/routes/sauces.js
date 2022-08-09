//Ensemble des routes et requete qui sont en rapport avec les sauces

const express = require('express');
//appel de la methode router d'express pour les prochaines route en rapport avec les sauces
const router = express.Router();

/* importation de plusieurs middleware/controllers nécéssaire a la bonne completion des routes : 
    saucesCtrl contient l'ensemble des regles a executer en fonction de la requete et de l'evenement lié.
    auth permettra a chaque requete d'authentifier l'utilisateur.
    mutler permettra de gerer les images des différentes sauce (donner un nom, suppression du backend, ect)
    right donnera, ou non les droit de modifier une sauce via les routes put ou delete.
*/ 
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const right = require('../middleware/have-right');


//Post de création de sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
//Get pour récupérer l'ensemble des sauces
router.get('/', auth, multer, saucesCtrl.getAllSauces);
//Get pour récupérer une sauce en particulier (via l'id) 
router.get('/:id', auth, multer, saucesCtrl.getOneSauce);
//Put pour modifier les informations lié à une sauce
router.put('/:id', auth, multer, right.sauceRight, saucesCtrl.modifySauce);
//Delete pour supprimer une sauce de la base de donnée
router.delete('/:id', auth, multer, right.sauceRight, saucesCtrl.deleteSauce);

//Post pour gerer les like/dislike
router.post('/:id/like', auth, multer, saucesCtrl.likeSauce);

module.exports = router;