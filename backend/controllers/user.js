require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');

const User = require('../models/User');
const password = require('../models/Password');

exports.signup = (req, res, next) => {
    if(password.passwordSchema.validate(req.body.password)){
        bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT))
        .then( hash =>{
            const user = new User({
                email : req.body.email,
                password : hash
            });
            user.save()
                .then(() => res.status(201).json({ message : 'Utilisateur crée !'}))
                .catch(error => res.status(400).json({ error} + "Une erreur de transmission de donnée est survenue." ));
        })
        .catch( error => res.status(500).json({ error }  + "Une erreur de serveur est survenue." ));   
    } else {
        res.status(400).json({ message : 'Le mot de passe doit avoir 8 caractères minimum, une majuscule et un chiffre au moins !'});
    }

}


exports.login = (req, res, next) => {
    User.findOne({email : req.body.email})
        .then(user => {
            if(user === null){
                res.status(401).json({ message : 'Paire identifiant/mot de passe incorrecte !'});
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then( valid => {
                        if(!valid){
                            res.status(401).json({ message : 'Paire identifiant/mot de passe incorrecte !'});
                        } else {
                            res.status(200).json({
                                userId : user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.JWT_SECRET_SENTENCE,
                                    { expiresIn: '24h' }
                                )
                            })
                        }
                    })
                    .catch(error =>{ res.status(500).json({ error }  + "Une erreur de serveur est survenue !"  ); })
            }
        })
        .catch(error =>{ res.status(500).json({ error } + "Une erreur de serveur est survenue !" ); })
}