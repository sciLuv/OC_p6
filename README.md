# HOT TAKES

Site internet où l'utilisateur peut poster et modifier ses sauces favorites et liker/disliker l'ensemble des sauces présentent sur l'application.

Ce projet est réalisé dans le cadre de ma formation avec openclassrooms, j'ai construit le back-end (serveur, API, base de données) tandis que le front-end était fourni initialement.   

## Pour installer l'application : 

Cloner le repository github, puis, en ligne de commande se mettre dans le répertoire racine du projet.

### Le front-end

Exécuter ensuite les lignes suivante dans la console : 

> cd frontend
> npm install 
> npm start

le front-end demarre alors.

### Le Back-end

Retourner dans le dossier racine du projet et entrer ensuite les ligne suivantes dans la console :

> cd backend
> npm install
> nodemon server

Pour pouvoir accéder à l'application il faudra ensuite créer vos variables d'environnement sous la forme précisée dans le fichier .env-example.

## Technologies utilisées

pour ce qui est du back-end les technologies utilisées sont : 
- node JS
- express
- mongoDB
- mongoose
- mongoose-unique-validator
- dotenv
- bcrypt
- crypto-js
- jsonwebtoken
- password-validator
- helmet
- cors
- validator
- express-rate-limit