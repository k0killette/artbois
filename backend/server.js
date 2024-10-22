// Importation des modules nécessaires
const express = require('express') // Framework pour créer des serveurs web
const mysql = require('promise-mysql') // Bibliothèque pour gérer les connexions MySQL avec des promesses
const cors = require('cors') // Middleware pour autoriser les requêtes cross-origin (CORS)
const fileUpload = require('express-fileupload') // Middleware pour gérer l'upload de fichiers
const dotenv = require('dotenv') // Module pour charger les variables d'environnement depuis un fichier .env

// Chargement des variables d'environnement depuis le fichier .env
dotenv.config()
//console.log("Secret server:", process.env.SECRET)

// Création d'une instance de l'application Express
const app = express()

// Configuration des middlewares 
app.use(cors()) // Activation de CORS pour permettre les requêtes provenant de domaines différents
app.use(fileUpload()) // Activation de fileUpload pour gérer les fichiers uploadés
app.use(express.urlencoded({ extended: false })) // Parsing des url encodées (pour les données de formulaire)
app.use(express.json()) // Parsing des requêtes au format JSON
app.use('/public', express.static(__dirname + '/public')) // Sert les fichiers statiques à partir du dossier public

// Importation des routes
const authRoutes = require('./routes/authRoutes')
const newsRoutes = require('./routes/newsRoutes')
const orderRoutes = require('./routes/orderRoutes')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')

// Connexion à la base de données MySQL avec les variables d'environnement pour la configuration
mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}).then((db) => {
    console.log("Connexion à la BDD Art et Bois OK") // Confirme la connexion à la BDD

    // Vérification de la connexion à la BDD toutes les 10 secondes pour s'assurer que la connexion est maintenue
    setInterval(async() => {
        const res = await db.query('SELECT 1') // Envoie une requête basique pour maintenir la connexion
    }, 10000)

    // Définition de la route principale
    app.get('/', async(req, res, next) => {
        res.json({ status: 200, msg: "Bienvenue sur votre API Art et Bois" }) // Message de bienvenue à la racine
    })

    // Appel des routes de l'application avec la base de données comme argument
    authRoutes(app, db) // Routes d'authentification
    newsRoutes(app, db) // Routes pour les actualités
    orderRoutes(app, db) // Routes pour les commandes
    productRoutes(app, db) // Routes pour les produits
    userRoutes(app, db) // Routes pour les utilisateurs
}).catch(err => console.log(err)) // Gestion des erreurs de connexion à la base de données

// Configuration du port d'écoute
const PORT = process.env.PORT || 9100 // Utilise le port défini dans les variables d'environnement, sinon le port 9100 par défaut
app.listen(PORT, () => {
    console.log(`Serveur à l'écoute sur le port ${PORT}`) // Confirme que le serveur est actif et à l'écoute
})
