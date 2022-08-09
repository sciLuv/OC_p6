//module ajouté pour créer un schéma de mot de passe permettant des mot de passe sécurisé
const passwordValidator = require('password-validator');

/* construction du schéma en question : 
    minimum 8 caractere et maximum 30,
    il doit y avoir des majuscules, des minuscule et deux chiffres,
    les espaces et les symboles sont interdit.
*/
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)
.is().max(30)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.has().not().symbols()
.is().not().oneOf(['Azerty123']);

exports.passwordSchema = passwordSchema;