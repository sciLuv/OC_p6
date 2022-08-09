//fichier contenant le middleware d'authentification de session

// package permettant la création et la lecture de token d'authentification de session
const jwt = require('jsonwebtoken');

/* middleware permettant : 
    la recherche du token existant dans le header de la requete
    la vérification du token, qui donne acces à l'id de l'user
    l'ajout à la requete l'id de la personne */
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_SENTENCE);
        const userId = decodedToken.userId; 
        req.auth = {
            userId : userId
        };
        next();
    } catch(error){
        res.status(401).json({ error });
    }
};

