# Bienvenue

Bienvenue sur "Art&Bois : le site de référence sur l'ébénisterie d'art". Art&Bois est à la fois le site vitrine d'un atelier d'ébénisterie d'art et un site de vente en ligne. 
<img src="./public/images/readme/home.png" alt="bannière de l'application web"> 

Ce fichier est consacré à la partie **frontend** du projet, développée avec React et Vite pour une performance optimisée.

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

