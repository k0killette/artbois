# Bienvenue

Bienvenue sur "Art&Bois : le site de référence sur l'ébénisterie d'art". Art&Bois est à la fois le site vitrine d'un atelier d'ébénisterie d'art et un site de vente en ligne. 
<img src="./public/images/readme/home.png" alt="bannière de l'application web">

La première partie de ce README.md est consacré à la partie **backend** du projet.

<br/>

## Contexte 

Ce projet est réalisé dans le cadre de la Formation Intensive "Développeur Web Full-Stack - Javascript" de la 3W Academy.
Il s'agit néanmoins d'un projet réel : le client existe et le site sera mis en ligne. Cependant, le client étant actuellement en formation pour devenir ébéniste, la partie boutique du projet ne sera pas mise en ligne immédiatement.

<br/>

## Installation et configuration (backend)

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


Cette seconde partie est consacrée à la partie **frontend** du projet, développée avec React et Vite pour une performance optimisée.

<br/>

## Installation et configuration (frontend)

### Prérequis système :

L'application tourne actuellement sur :
- Node.js (version 19.1.0)
- Npm (version 9.1.2)

Voici la liste des packages utilisés dans ce projet et à installer pour le faire fonctionner : 
```
"dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.6.0",
    "@fortawesome/free-brands-svg-icons": "^6.6.0",
    "@fortawesome/free-regular-svg-icons": "^6.6.0",
    "@fortawesome/free-solid-svg-icons": "^6.6.0",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@reduxjs/toolkit": "^2.2.7",
    "@stripe/react-stripe-js": "^2.8.0",
    "@stripe/stripe-js": "^4.3.0",
    "axios": "^1.7.4",
    "moment": "^2.30.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-masonry-css": "^1.0.16",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.26.1",
    "react-slick": "^0.30.2",
    "redux": "^5.0.1",
    "redux-thunk": "^3.1.0",
    "slick-carousel": "^1.8.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^9.9.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "sass": "^1.77.8",
    "vite": "^5.4.1"
```

### Installation :

1. Clonez le dépôt Git : `git clone https://github.com/k0killette/artbois.git` ;
2. Installez les dépendances nécessaires dans le dossier du projet en utilisant `npm i` dans votre terminal ;
3. Créez un fichier **.env** à la racine du projet pour y ajouter les variables d'environnement :
 - `VITE_STRIPE_SECRET_KEY` 
 - `VITE_STRIPE_PUBLIC_KEY` 
 - `RECAPTCHA_SITE_KEY` pour intégrer Google reCAPTCHA ;
4. Assurez-vous que la partie backend de l'application est correctement configurée et lancée pour que le frontend puisse interagir avec elle. 
5. Démarrez le serveur de développement avec la commande `npm run dev`.

<br/>

## Fonctionnalités principales

### Authentification

L'application gère l'authentification des utilisateurs via un système sécurisé utilisant des JWT (JSON Web Tokens). Les utilisateurs peuvent s'inscrire, se connecter et accéder à leurs commandes. Les administrateurs disposent de privilèges supplémentaires pour la gestion des produits et des commandes.

### Catalogue de produits

- Affichage des produits disponibles à l'achat ;
- Gestion du panier avec ajout, suppression, et mise à jour des quantités ;
- Affichage détaillé des informations produit, incluant la disponibilité en stock.

### Paiement en ligne

L'application utilise Stripe pour les paiements sécurisés. L'utilisateur peut payer sa commande directement sur le site via un formulaire sécurisé. La gestion des paiements comprend :
- Création d'intentions de paiement ;
- Confirmation du paiement ;
- Envoi d'un reçu par email.

### Gestion des commandes

Les utilisateurs peuvent suivre l'état de leurs commandes (payée, expédiée, livrée, annulée) depuis leur espace personnel. Les administrateurs peuvent mettre à jour le statut des commandes via un tableau de bord dédié.

### Gestion des utilisateurs

Les utilisateurs peuvent s'inscrire avec une adresse e-mail et un mot de passe. Une fois connectés, ils peuvent :
- Mettre à jour leurs informations personnelles (adresse, mot de passe, etc.) ;
- Consulter leurs commandes passées ;
- Gérer leurs préférences de paiement et d'expédition.

### Gestion des actualités

La section "Actualités" permet à l'administrateur de publier des articles concernant l'atelier, les nouveaux produits ou tout événement lié à l'ébénisterie d'art. Cette fonctionnalité inclut :
- La création, modification et suppression d'articles ;
- L'ajout d'images associées aux articles ;
- La gestion des statuts des articles (en cours, passé, annulé...).

<br/>

## Structure du projet

Le projet frontend suit une architecture modulaire, facilitant l'ajout de nouvelles fonctionnalités. Voici un aperçu de la structure :

```
├── public/                       # Fichiers publics (images, favicon, etc.)
├── src/
│   ├── api/                      # Fichiers pour les appels API (ex. utilisateur, produits, commandes)
│   ├── assets/                   # Images et autres ressources statiques
│   ├── components/               # Composants réutilisables (boutons, cartes de produit, etc.)
│   ├── config/                   # Configuration de l'application (ex. URL des APIs)
│   ├── pages/                    # Pages principales (Accueil, Produit, Commande, etc.)
│   ├── slices/                   # Gestion de l'état global avec Redux (ex. panier, utilisateur)
│   ├── App.jsx                   # Composant principal de l'application
│   ├── main.jsx                  # Point d'entrée de l'application
├── .env                          # Variables d'environnement
├── package.json                  # Liste des dépendances et scripts
```

### Principaux composants

- api/ : contient les fonctions d'appel à l'API pour interagir avec le backend (ex : récupération des produits, enregistrement des commandes) ;
- components/ : regroupe les composants réutilisables dans toute l'application (ex : ProductCard, CartButton).
- pages/ : contient les pages principales de l'application (ex : Home, ProductDetails, Checkout) ;
- slices/ : gère l'état global de l'application à l'aide de Redux (gestion du panier, des utilisateurs, etc.).

<br/>

## Technologies utilisées

- React : framework JavaScript pour la construction d'interfaces utilisateur interactives ;
- Vite : outil de développement rapide pour React, offrant un temps de compilation réduit ;
- Redux : gestion de l'état global de l'application ;
- Stripe : gestion des paiements en ligne sécurisés ;
- SCSS : préprocesseur CSS utilisé pour la gestion des styles.

<br/>

## Auteurs

- Développeur Frontend : Camille Jalouneix
- Client : Alan Bocquillon - Art&Bois
