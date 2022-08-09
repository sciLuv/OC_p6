const express = require('express');
const Sauces = require('../models/Sauces');


//Permet de vérifié si l'utilisateur est autorisé à modifier le contenue d'une sauce. 
exports.sauceRight = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Vous n\'avez pas l\'authorisation de mettre à jour cette sauce !'});
            } else {
                next();
            }
        })
        .catch( error => {
            res.status(500).json({ error } + "Une erreur de serveur est survenue");
        });
};

