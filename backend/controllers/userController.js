/*
userController.js : ce contrôleur gère les opérations liées aux utilisateurs, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

// Utilitaire pour effectuer des requêtes HTTP externes
const axios = require('axios')
// Utilitaire pour le hashage des mots de passe
const bcrypt = require('bcryptjs')
// Nombre de salages pour le hashage des mots de passe
const saltRounds = 10 
// Bibliothèque pour la gestion des tokens JWT
const jwt = require('jsonwebtoken')
// Clé secrète pour signer les tokens JWT
const secret = process.env.SECRET

// Formate les données utilisateur pour être renvoyées au front
const formatUserResponse = (user) => ({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    address_1: user.address_1,
    address_2: user.address_2,
    zip: user.zip,
    city: user.city,
    phone: user.phone,
    role: user.role
})

module.exports = (UserModel) => {

    // Vérifie le token reCAPTCHA auprès de l'API de Google
    const validateRecaptcha = async(recaptchaToken) => {
        // Appelle la clé secrète reCAPTCHA stockée dans .env pour la vérification du token
        const secretKey = process.env.RECAPTCHA_SECRET_KEY 

        try {
            // Envoie une requête POST à l'API de Google reCAPTCHA pour valider le token fourni par le client
            const response = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify`, 
                {}, // Le corps de la requête est vide, les paramètres sont passés via "params"
                {
                    params: {
                        secret: secretKey, // La clé secrète côté serveur, pour autoriser la vérification
                        response: recaptchaToken, // Le token reçu du client qui doit être validé par l'API
                    },
                }
            )
            // Retourne les données de la réponse de Google (succès ou échec)
            return response.data
        }
        // Si une erreur survient lors de la requête ou du processus de validation, retourne un objet avec un message d'erreur
        catch (error) {
            return { success: false, msg: 'Erreur lors de la validation du reCAPTCHA' }
        }
    }

    // Enregistre un utilisateur dans la base de données
    const saveUser = async(req, res) => {
        try {
            // Appelle le modèle pour vérifier si un utilisateur dans la base de données possède déjà un compte avec cet email (on évite les doublons)
            const check = await UserModel.getOneUserByEmail(req.body.email)
            // Si une erreur survient lors de la vérification, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (check.code) {
                return res.json({ status: 500, msg: "Erreur lors de la vérification de l'email" })
            }
            // Si un utilisateur existe déjà dans la base de données avec cet email (check retourne un tableau qui n'est pas vide), renvoie une réponse avec un statut 401 (Unauthorized)
            if (check.length > 0) {
                return res.json({ status: 401, msg: "Un compte avec cet email existe déjà" })
            }
            // Si l'utilisateur n'a pas accepté les conditions, renvoie un message avec un statut 400 (Bad request)
            if (!req.body.terms_accepted) {
                return res.json({ status: 400, msg: "Vous devez accepter les conditions générales" })
            }
            // Vérification du token reCAPTCHA auprès de l'API Google
            const recaptchaValidation = await validateRecaptcha(req.body.recaptcha_token)
            // Si la validation du reCAPTCHA échoue ou si le score est inférieur à 0.5, renvoie une réponse avec un statut 400 (Bad Request)
            if (!recaptchaValidation.success || recaptchaValidation.score < 0.5) {
                return res.json({ status: 400, msg: "Échec du reCAPTCHA. Veuillez réessayer." })
            }
            
            // Appelle le modèle pour enregistrer l'utilisateur dans la base de données
            const user = await UserModel.saveOneUser(req)
            // Si une erreur survient lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (user.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de l'utilisateur" })
            }
            // Si l'enregistrement est réussi, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Utilisateur enregistré" })
            }    
        }
        // Gestion des erreurs globales lors de l'enregistrement de l'utilisateur
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement de l'utilisateur" })
        }
    }

    // Récupère un utilisateur par son id
    const getOneUser = async(req, res) => {
        try {
            // Appelle le modèle pour récupérer un utilisateur par son id
            const user = await UserModel.getOneUser(req.params.id)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (user.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération de l'utilisateur" })
            }
            // Sinon si aucun utilisateur n'est trouvé, renvoie une réponse avec un statut 404 (Not Found)
            else if (user.length === 0) {
                res.json({ status: 404, msg: "Utilisateur introuvable" })
            }
            // Sinon l'utilisateur est trouvé, formate les données et les renvoie avec un statut 200 (OK)
            else {
                const loadedUser = formatUserResponse(user[0])
                res.json({ status: 200, user: loadedUser })
            }
        }
        // Gestion des erreurs globales lors de la récupération de l'utilisateur
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération de l'utilisateur" })
        }
    }

    // Récupère tous les utilisateurs 
    const getAllUsers = async(req, res) => {
        try {
            // Appelle le modèle pour récupérer tous les utilisateurs
            const users = await UserModel.getAllUsers()
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (users.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération des utilisateurs" })
            }
            // Si la récupération est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: users })
            }
        }
        // Gestion des erreurs globales lors de la récupération des utilisateurs
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des utilisateurs" })
        }
    }

    // Connecte à un compte utilisateur
    const loginUser = async(req, res) => {
        try {
            // Appelle le modèle pour vérifier si un utilisateur dans la base de données possède un compte avec cet email
            const check = await UserModel.getOneUserByEmail(req.body.email)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (check.code) {
                res.json({ status: 500, msg: "Erreur lors de la vérification de l'email" })
            }
            // Si aucun compte n'existe avec cet email, retourne un message d'erreur avec un statut 404 (Not Found)
            else if (check.length === 0) {
                res.json({ status: 404, msg: "Erreur d'identification" }) // Par sécurité on renvoie un message générique pour les erreurs d'authentification afin de ne pas indiquer précisément où se trouve l'erreur (email ou mot de passe incorrect)
            }
            // Sinon compare les mots de passe
            else {
                // Compare le mot de passe fourni avec celui stocké dans la base de données
                const same = await bcrypt.compare(req.body.password, check[0].password)
                // Si les mots de passe correspondent
                if (same) {
                    // Crée le payload du token avec l'id et le rôle de l'utilisateur (payload = valeurs qu'on va glisser dans le token... ATTENTION, ON NE MET PAS D'INFORMATIONS SENSIBLES !)
                    const payload = { id: check[0].id, role: check[0].role }
                    // Génère un algorithme (token JWT) en utilisant le payload et en vérouillant avec le secret
                    const token = jwt.sign(payload, secret)
                    // Formate les informations de l'utilisateur pour les renvoyer vers le frontend avec le token
                    const user = formatUserResponse(check[0])
                    // Renvoie une réponse avec un statut 200 (OK), le token JWT et les informations de l'utilisateur
                    res.json({ status: 200, token: token, user: user })
                }
                // Si les mots de passe ne correspondent pas, renvoie une réponse avec un statut 404 (Not Found)
                else {
                    res.json({ status: 404, msg: "Erreur d'identification" })
                }
            }
        }
        // Gestion des erreurs globales lors de la connexion
        catch (err) {
            res.json({ status: 500, msg: "Echec de la connexion" })
        }
    }

    // Déconnecte l'utilisateur 
    const logoutUser = async(req, res) => {
        // Renvoie une réponse avec un statut 200 (OK) pour indiquer que l'utilisateur est déconnecté
        res.json({ status: 200, msg: "Vous avez été déconnecté(e)" })
    }

    // Met à jour les informations d'un utilisateur    
    const updateUser = async(req, res) => {
        try {
            // Appelle le modèle pour mettre à jour l'utilisateur dans la base de données
            const updatedUser = await UserModel.updateOneUser(req, req.params.id)
            // Si une erreur survient lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (updatedUser.code) {
                res.json({ status: 500, msg: "Erreur lors de la mise à jour de l'utilisateur" })
            }
            // Sinon, récupère les nouvelles informations de l'utilisateur
            else {
                // Appelle le modèle pour récupérer l'utilisateur mis à jour
                const newUser = await UserModel.getOneUser(req.params.id)
                // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
                if (newUser.code) {
                    res.json({ status: 500, msg: "Erreur lors de la récupération de l'utilisateur" })
                }
                // Sinon, renvoie une réponse avec un statut 200 (OK) et les informations mises à jour de l'utilisateur
                else {
                    const myUser = formatUserResponse(newUser[0])
                    res.json({ status: 200, msg: "Utilisateur mis à jour", newUser: myUser })
                }
            }
        }
        // Gestion des erreurs lors de la mise à jour
        catch (err) {
            res.json({ status: 500, msg: "Echec de la mise à jour du profil utilisateur" })
        }
    }
    
    // Supprime un utilisateur
    const deleteUser = async(req, res) => {
        try {
            // Appelle le modèle pour supprimer l'utilisateur de la base de données
            const deletedUser = await UserModel.deleteOneUser(req.params.id)
            // Si une erreur survient lors de la suppression, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (deletedUser.code) {
                res.json({ status: 500, msg: "Erreur lors de la suppression de l'utilisateur" })
            }
            // Sinon, renvoie une réponse avec un statut 200 (OK) pour indiquer que l'utilisateur a été supprimé
            else {
                res.json({ status: 200, msg: "Utilisateur supprimé" })
            }
        }
        // Gestion des erreurs lors de la suppression
        catch (err) {
            res.json({ status: 500, msg: "Echec de la suppression de l'utilisateur" })
        }
    }
    
    // Met à jour le rôle d'un utilisateur 
    const updateUserRole = async(req, res) => {
        try {
            // Appelle le modèle pour mettre à jour le rôle de l'utilisateur dans la base de données
            const updatedUser = await UserModel.updateUserRole(req.body.userId, req.body.role)
            // Si une erreur survient lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if(updatedUser.code){
                res.json({ status: 500, msg: "Erreur lors de la mise à jour du rôle de l'utilisateur" })
            }
            // Sinon, renvoie une réponse avec un statut 200 (OK) pour indiquer que le rôle de l'utilisateur a été mis à jour
            else {
                res.json({ status: 200, msg: "Rôle de l'utilisateur mis à jour" })
            }
        }
        // Gestion des erreurs lors de la mise à jour du rôle
        catch (err) {
            res.json({ status: 500, msg: "Erreur lors de la mise à jour du rôle de l'utilisateur" })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveUser,
        getOneUser,
        getAllUsers,
        loginUser,
        logoutUser,
        updateUser,
        updateUserRole,
        deleteUser
    }
}
