const withAuth = require ('../middleware/withAuth')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

module.exports = (app, db) => {
    const UserModel = require("../models/UserModel")(db)
    const authController = require("../controllers/authController")(UserModel)
    
    // Route pour la vérification du token et la reconnexion automatique
    app.get('/api/artbois/users/checkToken', withAuth, authController.checkToken)
}