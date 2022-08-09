const mongoose = require('mongoose');

//package utile pour prévenir des erreurs de base de données vis a vis des email uniques en son sein.
const uniqueValidator = require('mongoose-unique-validator');

/* Utilisation des schemas de mongoose pour creer l'objet user.
    l'email droit etre unique */
const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true}
});

//utilisation du package vu précédemment sur le schéma
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
