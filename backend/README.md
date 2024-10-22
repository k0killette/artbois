# Bienvenue

Bienvenue sur "Art&Bois : le site de référence sur l'ébénisterie d'art". Art&Bois est à la fois le site vitrine d'un atelier d'ébénisterie d'art et un site de vente en ligne. 
<img src="./public/images/readme/home.png" alt="bannière de l'application web">

Ce fichier est consacré à la partie **backend** du projet.

<br/>

## Contexte 

Ce projet est réalisé dans le cadre de la Formation Intensive "Développeur Web Full-Stack - Javascript" de la 3W Academy.
Il s'agit néanmoins d'un projet réel : le client existe et le site sera mis en ligne. Cependant, le client étant actuellement en formation pour devenir ébéniste, la partie boutique du projet ne sera pas mise en ligne immédiatement.

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
    "axios": "^1.7.7",
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-fileupload": "^1.5.1",
    "file-type": "^16.5.4",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "promise-mysql": "^5.2.0",
    "stripe": "^16.7.0",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
```
<br/>

### Installation :

1. Clonez le dépôt Git : `git clone https://github.com/k0killette/artbois.git` ;
2. Installez les dépendances nécessaires en utilisant `npm i` dans votre terminal ;
3. Créez un fichier **.env** à la racine du projet pour y ajouter les variables d'environnement :
   - `SECRET` pour signer et vérifier les JSON Web Tokens (JWT),
   - `STRIPE_API_KEY_TEST` pour utiliser l'API Stripe en mode test (vous devez créer un compte Stripe et consulter la documentation https://docs.stripe.com/keys),
   - RECAPTCHA_SECRET_KEY et RECAPTCHA_SITE_KEY pour intégrer Google reCAPTCHA,
   - les informations de connexion à la base de données :
    ```    
        DB_HOST=YOUR_HOST
        DB_DATABASE=YOUR_DB
        DB_USER=YOUR_USER
        DB_PASSWORD=YOUR_PASSWORD
    ``` 
4. Importez le fichier **jalouneixcamille_artbois.sql** dans votre logiciel de base de données ;
5. Configurez les informations de connexion à la base de données dans le fichier server.js ;
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
- **models** : ce dossier contient l'ensemble des modèles de données *NewsImageModel, NewsModel, NewsStatusModel, OrderDetailModel, OderModel, OrderStatusModel, ProductCategoryModel, ProductImageModel, ProductModel, UserModel*. Ces fichiers définissent des méthodes pour interagir avec la base de données et effectuer des opérations CRUD (Create, Read, Update, Delete) ;
- **controllers** : ce dossier contient les fichiers contrôleurs *authController, newsController, newsImageController, newsStatusController, oderController, orderDetailController, orderStatusController, productCategoryController, productController, productImageController, userController*. Ces fichiers gèrent les différentes opérations liées aux entités (enregistrement, récupération, mise à jour, suppression) ;
- **routes** : ce dossier contient les fichiers qui définissent les routes de l'application. Chaque route est associée à une méthode du contrôleur pour traiter la requête correspondante ;
- **public** : ce dossier contient les fichiers statiques, comme les images, accessibles directement par le navigateur ;
- **middlewares** : ce dossier contient les middlewares qui interviennent dans les requêtes HTTP, comme la gestion de l'authentification ou la validation des données entrantes ;
- **utils** : ce dossier contient les fichiers utilitaires *imageValidation et shippingCalculator* qui fournissent des fonctions réutilisables dans plusieurs parties du projet.

<br/>

## Fonctionnalités particulières

### Enregistrement d'image

Chaque image envoyée passe par un processus de validation qui inclut :
- la vérification de la taille du fichier : la taille de l'image doit être inférieure à 2 Mo ;
- la vérification du type de fichier : seules les extensions d'images autorisées sont acceptées (JPG, JPEG, PNG, GIF, WEBP) ;
- la validation du contenu MIME : le contenu du fichier doit correspondre à son extension ;
- la génération de noms de fichiers uniques : les images sont renommées avec un identifiant unique pour éviter les conflits ;
- le stockage de fichiers : les images sont stockées dans un répertoire spécifique du serveur et leur URL est enregistrée dans la base de données.

Le code associé à cette fonctionnalité se trouve dans le fichier utilitaire imageValidation.js.

<br/>

### Gestion des utilisateurs

L'enregistrement et la connexion des utilisateurs passent par différents processus pour les sécuriser : 
- utilisation de JWT pour la gestion des sessions utilisateurs ;
- hashage des mots de passe avec bcrypt ;
- définition de différents rôles, administrateurs et utilisateurs, pour restreindre certaines actions.

<br/>

### Gestion des commandes

La gestion des commandes est strictement réservée aux administrateurs : 
- gestion des commandes après un paiement réussi, enregistrement des détails des commandes et calcul des frais d'expédition ;
- mise à jour du statut des commandes (expédiée, livrée...).

<br/>

### Sécurité

L'utilisation de Google reCAPTCHA permet d'éviter les soumissions de formulaires automatisées lors de l'enregistrement d'un utilisateur : 
- reCAPTCHA v3 renvoie un score pour chaque requête sans friction pour l'utilisateur ;
- reCAPTCHA v3 n'interrompt jamais les utilisateurs ;
- reCAPTCHA v3 renvoie un score (1,0 correspond très probablement à une interaction humaine, 0,0 correspond très probablement à une interaction automatique).

<br/>

### Paiement par Stripe

L'intégration de Stripe permet la gestion des paiements en ligne via l'API Stripe. Les fonctionnalités liées à Stripe comprennent :
- la création d'intentions de paiement : lors du paiement, une intention de paiement est générée avec le montant total de la commande (incluant la somme des produits et les frais d'expédition) ;
- la gestion des paiements en euros ;
- la confirmation de paiement via `client_secret` : le backend renvoie un `client_secret` à l'application frontend, qui utilise ce secret pour confirmer et valider le paiement ;
- l'envoi de reçus : un email de confirmation de paiement est envoyé à l'utilisateur à la fin de la transaction.

<br/>

## Dossier lié 

La partie frontend de l'application est également accessible dans le dépôt  [https://github.com/k0killette/artbois](https://github.com/k0killette/artbois)