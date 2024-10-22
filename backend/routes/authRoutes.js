/* 
Ce fichier gère les routes d'authentification, notamment la vérification des tokens et la reconnexion automatique des utilisateurs en fonction de leurs droits.
*/

// Importation du middleware withAuth qui protège certaines routes en autorisant uniquement les utilisateurs authentifiés à y accéder
const withAuth = require('../middleware/withAuth')
// Importation du module jsonwebtoken qui est utilisé pour la gestion des tokens JWT
const jwt = require('jsonwebtoken')
// Récupération de la clé secrète (secret) stockée dans le fichier .env pour signer et vérifier les tokens JWT
const secret = process.env.SECRET

module.exports = (app, db) => {
    // Importation du modèle UserModel avec accès à la base de données pour interagir avec la table des utilisateurs
    const UserModel = require('../models/UserModel')(db)
    // Importation du contrôleur d'authentification avec le modèle UserModel en paramètre pour gérer les opérations liées à l'authentification des utilisateurs (connexion, vérification du token, etc.)
    const authController = require('../controllers/authController')(UserModel)

    // (vérifiée)
    // Route pour la vérification du token et la reconnexion automatique
    app.get('/api/artbois/users/checkToken', withAuth, authController.checkToken)
}
