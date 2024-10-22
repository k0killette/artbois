/* 
Ce fichier gère les routes pour la gestion des utilisateurs.
*/

// Importation du middleware withAuth qui protège certaines routes en autorisant uniquement les utilisateurs authentifiés à y accéder
const withAuth = require('../middleware/withAuth')
// Importation du middleware withAuthAdmin qui protège certaines routes en autorisant uniquement les administrateurs authentifiés à y accéder
const withAuthAdmin = require('../middleware/withAuthAdmin')
// Importation du middleware validateData qui valide les données des requêtes (par exemple, lors de l'inscription ou de la connexion d'un utilisateur)
const validateData = require('../middleware/validateData')

module.exports = (app, db) => {
    // Importation du modèle UserModel avec accès à la base de données pour interagir avec la table des utilisateurs
    const UserModel = require('../models/UserModel')(db)
    // Importation du contrôleur userController avec le modèle UserModel en paramètre pour gérer les opérations liées aux utilisateurs (inscription, connexion, etc.)
    const userController = require('../controllers/userController')(UserModel)

    // (vérifiée)
    // Route de connexion d'un utilisateur (c'est ici qu'on va créer le token qu'on va envoyer vers le front) avec vérification des données de connexion 
    app.post('/api/artbois/users/login', validateData.validateLogin, userController.loginUser)

    // (vérifiée)
    // Route d'enregistrement d'un utilisateur avec vérification des informations fournies par l'utilisateur
    app.post('/api/artbois/users', validateData.validateUser, userController.saveUser)

    // (vérifiée)
    // Route de récupération de tous les utilisateurs avec accès limité aux administrateurs authentifiés
    app.get('/api/artbois/users', withAuthAdmin, userController.getAllUsers)
    
    // (vérifiée)
    // Route de récupération d'un utilisateur avec accès limité aux utilisateurs authentifiés
    app.get('/api/artbois/users/:id', withAuth, userController.getOneUser)

    // (vérifiée)
    // Route de modification d'un utilisateur avec accès limité aux utilisateurs authentifiés
    app.put('/api/artbois/users/:id', withAuth, userController.updateUser)

    // (vérifiée)
    // Route de suppression d'un utilisateur avec accès limité aux utilisateurs authentifiés
    app.delete('/api/artbois/users/:id', withAuth, userController.deleteUser)
}
