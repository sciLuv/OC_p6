const mongoose = require('mongoose');

/* Utilisation des schemas de mongoose pour creer l'objet sauce. 
   Certain doivent avoir une forme par defaut car non créer dans le formulaire lié a l'objet dans le HTML*/
const saucesSchema  = mongoose.Schema({
    userId : {type : String, required : true},
    name : {type : String, required : true},
    manufacturer : {type : String, required : true},
    description : { type : String, required : true},
    mainPepper : {type : String, required : true},
    imageUrl : {type : String, required : true },
    heat : {type : Number, required : true},
    likes : {type : Number, default: 0},
    dislikes : {type : Number, default: 0},
    usersLiked : {type : Array, default: []},
    usersDisliked : {type : Array, default: []}
})

//on exporte le schema en tant que model d'objet représentant la sauce
module.exports = mongoose.model('Sauces', saucesSchema);