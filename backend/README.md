# Bienvenue

Bienvenue sur "Art&Bois : le site de référence sur l'ébénisterie d'art". Art&Bois est à la fois le site vitrine d'un atelier d'ébénisterie d'art et un site de vente en ligne. 
<img src="/public/images/readme/home.png" alt="bannière de l'application web">

Ce fichier est consacré à la partie **backend** du projet.

<br/>

## Contexte 

Ce projet est réalisé dans le cadre de la Formation Intensive "Développeur Web Full-Stack - Javascript" de la 3W Academy.
Il s'agit néanmoins d'un projet réel, le client existe et le site sera mis en ligne. Cependant, le client étant actuellement en formation pour devenir ébéniste, la partie boutique du projet ne sera pas mise en ligne immédiatement.

<br/>

## Installation et configuration 

### Prérequis système :

L'application tourne actuellement sur :
- Node.js (version 19.1.0)
- Npm (version 9.1.2)

Voici la liste des packages utilisés dans ce projet et à installer pour le faire fonctionner : 
```
"dependencies": {
    "@hapi/address": "^5.1.1",
    "@hapi/tlds": "^1.0.6",
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-fileupload": "^1.5.1",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "promise-mysql": "^5.2.0",
    "stripe": "^16.7.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
```
<br/>

### Installation :

1. Clonez le dépôt Git : `git clone https://github.com/XXXXXXXXXX` ;
2. Installez la stack technique nécessaire en utilisant `npm i` dans votre terminal ;
3. Créez un fichier **.env** à la racine du projet pour y ajouter les variables d'environnement :
   - `SECRET` pour signer et vérifier les JSON Web Tokens (JWT),
   - `STRIPE_API_KEY_TEST` pour utiliser l'api Stripe en mode test (vous devez créer un compte stripe et vous référez à la documentation https://docs.stripe.com/keys) ;
4. Importez le fichier **jalouneixcamille_artbois.sql** dans votre logiciel de base de données ;
5. Créez les fichiers **config.js** (pour le production) et **config-offline.js** (pour le développement) à la racine de votre projet pour y mettre les informations concernant votre DB.
   ```
   module.exports = {
       db: {
            host: "YOUR HOST",
            database: "YOUR DB",
            user: "YOUR USER",
            password: "YOUR PASSWORD"
        }
   };
   ```

6. Démarrez le serveur avec la commande `npm run dev`.

### Identifiants de connexion :
    
    Compte administrateur :
        - Adresse e-mail : administr@teur.com
        - Mot de passe : Password123!
    
    Compte utilisateur :
        - Adresse e-mail : azerty@qwerty.com
        - Mot de passe : Password123!

<br/>

## Contenu du projet

Le projet est organisé en plusieurs dossiers : 
- **models** : ce dossier contient l'ensemble des modèles de données *CategoryModel, ImageModel, NewsModel, OrderDetailModel, OderModel, ProductModel, UserModel*. Ces fichiers définissent des méthodes pour interagir avec la base de données et effectuer des opérations telles que la création, la récupération, la mise à jour et la suppression des entrées (méthode CRUD) ;
- **controllers** :
- **routes** : 
- **public** : 
- **middlewares** : 
- **utils** : 

<br/>

