
//Package permettant de crypter les mot de passe des utilisateurs  
const bcrypt = require('bcrypt');
//Package permettant la création et la lecture de token d'authentification de session
const jwt = require('jsonwebtoken');
//Package permettant la création de regle pour l'écriture de mot de pass
const passwordValidator = require('password-validator');
//pakage permettant grace a sa methode isEmail de valider la forme que prend l'email passé par l'utilisateur, et de lui ajouté des caractere interdit  
const validator = require('validator');


const cryptoJS = require('crypto-js');


//on appel les modeles du mot de passe et des user
const User = require('../models/User');
const password = require('../models/Password');

/*  middleware lié à la création d'un nouvel utilisateur :
    Si l'email correspond au modele attendu par validator.isEmail, on cryptele mot de passe puis
    si le mot de passe passé par l'utilisateur est conforme au schema prévu : (methode validate de password-validator)
    il est passé a bcrypt qui le crypte et le passe a l'objet user en tant que mot de passe
    l'objet user est ensuite envoyer à la base de données
*/ 
exports.signup = (req, res, next) => {
    if(validator.isEmail(req.body.email, {blacklisted_chars: '$&µ*%ù~²£¤#^@+[ç!àè§:)(}\'|{\""/='}) == true){
        const cryptedMail = cryptoJS.HmacSHA256(req.body.email, process.env.CRYPTO_JS_SECRET_SENTENCE).toString();
        if(password.validate(req.body.password)){
            bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT))
            .then( hash =>{
                const user = new User({
                    email : cryptedMail,
                    password : hash
                });
                user.save()
                    .then(() => res.status(201).json({ message : 'Utilisateur crée !'}))
                    .catch(error => res.status(400).json({ error} + "Une erreur de transmission de donnée est survenue." ));
            })
            .catch( error => res.status(500).json({ error }  + "Une erreur de serveur est survenue." ));   
        } else {
            res.status(400).json({ message : 'Le mot de passe ne doit pas avoir de symbole et doit avoir 8 caractères minimum, une majuscule et un chiffre au moins !'});
        }
    } else {
        res.status(401).json({ message : 'L\'adresse mail n\'est pas dans un format correcte.'});
    }
}

/*  Middleware lié au login de l'utilisateur et à la création d'un token de session
    on crypte l'email passé par l'utilisateur et on recherche un user via l'email crypté.
    si il est présent (user non null) dans la base de donnée on compare le mot de passe rentrer avec celui en base de donnée avec bcrypt.compare
    si ils sont semblable on construit un token avec json web token et on le passe dans la réponse du serveur */
exports.login = (req, res, next) => {
    const cryptedMail = cryptoJS.HmacSHA256(req.body.email, process.env.CRYPTO_JS_SECRET_SENTENCE).toString();
    User.findOne({email : cryptedMail})
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