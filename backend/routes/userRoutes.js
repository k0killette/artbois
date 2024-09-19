const withAuth = require("../middleware/withAuth")
const withAuthAdmin = require('../middleware/withAuthAdmin')
const validateData = require('../middleware/validateData')


module.exports = (app, db) => {
    const UserModel = require("../models/UserModel")(db)
    const userController = require("../controllers/userController")(UserModel)

    // Route d'enregistrement d'un utilisateur
    app.post("/api/artbois/users/save", validateData.validateUser, userController.saveUser)
    
    // Route de récupération d'un utilisateur
    app.get("/api/artbois/users/:id", withAuth, userController.getOneUser)
    
    // Route de récupération de tous les utilisateurs
    app.get("/api/artbois/users", withAuthAdmin, userController.getAllUsers)
    
    // Route de connexion d'un utilisateur (c'est ici qu'on va créer le token qu'on va envoyer vers le front)
    app.post("/api/artbois/users/login", validateData.validateLogin, userController.loginUser)

    // Route de modification d'un utilisateur
    app.put("/api/artbois/users/update/:id", withAuth, userController.updateUser)

    // Route de suppression d'un utilisateur
    app.delete("/api/artbois/users/delete/:id", withAuth, userController.deleteUser)
}