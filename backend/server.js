// Importation des modules
const express = require("express")
const mysql = require("promise-mysql")
const cors = require("cors")
const fileUpload = require('express-fileupload')
const dotenv = require("dotenv")

// Chargement des variables d'environnement
dotenv.config()
//console.log("Secret server:",process.env.SECRET)

// Importation de nos routes
const authRoutes = require("./routes/authRoutes")
const orderRoutes = require("./routes/orderRoutes")
const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")

// Création d'une instance de l'application Express
const app = express()

// Configuration des middlewares
app.use(cors()) // Activation de CORS
app.use(fileUpload({ createParentPath: true })) // Gestion des fichiers uploadés
app.use(express.urlencoded({ extended: false })) // Parsing des url
app.use(express.json()) // Parsing des JSON
app.use(express.static(__dirname + '/public')) // Gestion des fichiers statiques

// Connexion à la base de données
mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}).then((db) => {
    console.log('Connexion à la BDD Art et Bois OK')
    
    // Vérification de la connexion à la BDD toutes les 10 secondes
    setInterval(async() => {
        const res = await db.query("SELECT 1")
    }, 10000)
    
    // Définition de la route racine
    app.get('/', async(req, res, next) => {
        res.json({ status: 200, msg: "Bienvenue sur votre API Art et Bois" })
    })
    
    // Appel des routes
    authRoutes(app, db)
    orderRoutes(app, db)
    productRoutes(app, db)
    userRoutes(app, db)
}).catch(err => console.log(err))

// Configuration du port d'écoute
const PORT = process.env.PORT || 9100
app.listen(PORT, () => {
    console.log(`Serveur à l'écoute sur le port ${PORT}`)
})
