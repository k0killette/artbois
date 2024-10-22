/*
Ce fichier permet de vérifier à la fois l'authentification et le rôle d'administrateur via un token JWT.
Il est utilisé pour protéger l'accès aux routes réservées aux administrateurs.
Si le token JWT est valide et que l'utilisateur a le rôle "admin", l'accès à la route est autorisé, sinon une erreur est renvoyée.
*/

const jwt = require('jsonwebtoken')
const secret = process.env.SECRET // Récupère la clé secrète pour la vérification des tokens JWT

// Middleware qui va autoriser ou non la reconnexion automatique d'un utilisateur, et autoriser ou non l'accès aux routes protégées
const withAuthAdmin = (req, res, next) => {
    // Récupération du token JWT dans le header de la requète HTTP (utilisé pour vérifier l'authentification)
    const token = req.headers['x-access-token']
    //console.log("Token reçu: ", token) // Vérification du token reçu

    // Si le token n'est pas trouvé, renvoie une erreur 404 (non trouvé)
    if (token === undefined) {
        return res.json({ status: 404, msg: "Erreur, le token n'a pas été trouvé" })
    }
    // Sinon (le token a été trouvé) vérifie sa validité avec la fonction de vérification de jsonwebtoken
    else {
        jwt.verify(token, secret, (err, decoded) => {
            // Si le token est invalide ou a expiré, renvoie une erreur 401 (non autorisé)
            if (err) {
                //console.log("Erreur lors de la vérification du token admin: ", err)
                return res.json({ status: 401, msg: "Erreur, requête non autorisée" })
            }
            // Si le token est vérifié et valide, vérifie que l'utilisateur a le rôle "admin"
            else {
                // Si le rôle de l'utilisateur n'est pas "admin", renvoie une erreur 403 (interdiction d'accès)
                if (!decoded.role || decoded.role !== "admin") {
                    return res.json({ status: 403, msg: "Erreur, accès restreint aux administrateurs" })
                }
                // Sinon s'il est "admin"
                else {
                    // On ajoute l'id de l'utilisateur dans la requête
                    req.id = decoded.id
                    // Autorise l'accés à la route protégée
                    next()
                }
            }
        })
    }
}

module.exports = withAuthAdmin
