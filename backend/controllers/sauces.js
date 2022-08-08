const fs = require('fs');
const Sauces = require('../models/Sauces');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => { res.status(201).json({message: 'sauce enregistré !'})})
    .catch(error => { res.status(400).json( { error } + "Une erreur de transmission de donnée est survenue." )})
}

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue."));
}

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then( sauce => res.status(200).json(sauce))
        .catch( error => res.status(200).json({ error} + "Une erreur de transmission de donnée est survenue."));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifié!'}))
                .catch(error => res.status(401).json({ error } + "Il manque une information dans les champs qui représente votre sauce."));
            }
        })
        .catch((error) => {
            res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue.");
        });
}

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error } + "Une erreur de transmission de donnée est survenue."));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error } + "Une erreur de serveur est survenue");
        });
};

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