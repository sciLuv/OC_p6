//package natif de nodeJS qui permet d'intéragir avec le systeme de fichiers
const fs = require('fs');

//le modele de l'objet sauce
const Sauces = require('../models/Sauces');
//Middleware qui permet de vérifier certains contenue sensible à la sécurité dans les champs remplis par l'utilisateur
const sanitize = require('../middleware/sanitize');

// création de la sauce : 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //supprime l'id et le userID initialement mis dans la requete (delete).
    delete sauceObject._id;
    delete sauceObject._userId;
    //puis cree un objet sauce a partir d'element de la requete et lui assigne un id et ajoute l'image. (new Sauces)
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //Finalement, envoie l'objet crée sur la base de données.
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
    .catch(error => { res.status(400).json( { error } + "Une erreur de transmission de donnée est survenue." )})
}

//va chercher l'ensemble des sauces pour pouvoir les afficher
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue."));
}

//va chercher une sauce, via son id, passé en paramettre de l'url
exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then( sauce => res.status(200).json(sauce))
        .catch( error => res.status(200).json({ error} + "Une erreur de transmission de donnée est survenue."));
}

//Pour modifier une sauce déjà crée
exports.modifySauce = (req, res, next) => {
    //on vérifie si la requete possede une image, si c'est le cas on creer l'url de la nouvelle image
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    //si ce n'est pas le cas on récupere l'objet dans le corps de la requete.
    } : { ...req.body };

    //pour sécuriser l'app on supprime l'actuel id de l'utilisateur de la requete, par mesure de sécurité.
    delete sauceObject._userId;
    //On va chercher une sauce, via son id, passé en paramettre de l'url (findOne) 
    Sauces.findOne({_id: req.params.id})
        .then(sauce => {
    //si l'image de la sauce est modifiée, on supprime l'ancienne
            if(req.file){
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`,(err) => {
                    if (err) throw err;
                    console.log('Fichier supprimé !');
                 });
            }
    //Puis on va changer les information de la base de donnée avec celle de la requete (updateOne)
            Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
            .catch(error => res.status(401).json({ error } + "Il manque une information dans les champs qui représente votre sauce."));
        })
        .catch((error) => {
            res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue.");
        });
}

//pour supprimer une Sauce de la base de données 
exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                    .catch(error => res.status(401).json({ error } + "Une erreur de transmission de donnée est survenue."));
            });
        })
        .catch( error => {
            res.status(500).json({ error } + "Une erreur de serveur est survenue");
        });
};

/*  Pour liker/disliker une sauce 
    en fonction de la variable like passé en requete, on ajoute/supprime les ids des utilisateurs des tableaux représentant les 
    utilisateurs ayant like/dislike les sauces, et on ajoute 1 ou -1 à la valeurs des like/dislike des objets représentant les sauces dans la base de donnée  */
exports.likeSauce = (req, res, next) => {
            let like = req.body.like;
            let userId = req.body.userId;
            let sauceId = req.params.id;
            switch(like){
                //like
                case 1 : 
                    Sauces.updateOne(
                        { _id: sauceId },
                        {  $push: {  usersLiked: userId }, $inc: { likes: +1 } }
                    )
                    .then(() => res.status(200).json({ message: 'like ajouté !' }))
                    .catch(error => res.status(401).json({ error } + "Une erreur de transmission de donnée est survenue."));
                    break;
                //dislike
                case -1: 
                    Sauces.updateOne(
                        { _id: sauceId },
                        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
                    )
                    .then(() => res.status(200).json({ message: 'dislike ajouté !' }))
                    .catch(error => res.status(401).json({ error } + "Une erreur de transmission de donnée est survenue." ));
                    break;
                //réinitialisation des likes
                case 0 :
                    Sauces.findOne({ _id: sauceId })
                    .then(sauce => {
                        if (sauce.usersLiked.includes(userId)) {
                            Sauces.updateOne(
                                { _id: sauceId },
                                { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
                                )
                                .then(() => res.status(200).json({ message: 'like retiré' }))
                                .catch(error => res.status(401).json({ error } + "Une erreur de transmission de donnée est survenue."))
                        } else {
                            Sauces.updateOne(
                                { _id: sauceId },
                                { $pull: {  usersDisliked: userId }, $inc: {  dislikes: -1, } }
                                )
                                .then(() => res.status(200).json({ message: 'dislike retiré' }))
                                .catch( error => res.status(401).json({ error } + "Une erreur de transmission de donnée est survenue."))
                        }
                    })
                    .catch(error => res.status(401).json({ error } + "Une erreur de transmission de donnée est survenue."))
                    break;
            }
        }