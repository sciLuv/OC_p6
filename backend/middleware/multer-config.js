//Appel le package multer utilisé pour l'upload de fichier
const multer = require('multer');

//Convertis le mimetype des fichers en extension pour la futur image stockée.
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};


//fonction qui utilise des methodes de multer pour pouvoir récuperer l'image et lui donner un nom spécifique 
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const beforeName = file.originalname.split(' ').join('_');
    const name = beforeName.substring(0, beforeName.lastIndexOf('.'))
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//exporte la fonction précédente pour l'inclure dans les routes des sauces
module.exports = multer({storage: storage}).single('image');




