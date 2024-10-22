/* 
Ce fichier permet de vérifier l'authentification des utilisateurs via un token JWT. 
Il est utilisé pour protéger l'accès aux routes réservées aux utilisateurs connectés. 
Si le token JWT est valide, l'accès à la route est autorisé, sinon une erreur est renvoyée.
*/

const jwt = require('jsonwebtoken')
const secret = process.env.SECRET // Récupère la clé secrète pour la vérification des tokens JWT

// Middleware qui va autoriser ou non la reconnexion automatique d'un utilisateur, et autoriser ou non l'accès aux routes protégées
const withAuth = (req, res, next) => {
    // Récupération du token JWT dans le header de la requète HTTP (utilisé pour vérifier l'authentification)
    const token = req.headers['x-access-token'] // On peut aussi utiliser Bearer-token
    //console.log("Token reçu: ", token) // Vérification du token reçu

    // Si le token n'est pas trouvé, renvoie une erreur 404 (non trouvé)
    if (token === undefined) {
        return res.json({ status: 404, msg: "Erreur, token introuvable" })
    }
    // Sinon (le token a été trouvé) vérifie sa validité avec la fonction de vérification de jsonwebtoken
    else {
        jwt.verify(token, secret, (err, decoded) => {
            // Si le token est invalide ou a expiré, renvoie une erreur 401 (non autorisé)
            if (err) {
                //console.log("Erreur lors de la vérification du token:", err)
                return res.json({ status: 401, msg: "Erreur, requête non autorisée" })
            }
            // Si le token est vérifié et valide
            else {
                // On ajoute la propriété id de l'utilisateur décodé dans la requête, pour récupérer les informations de l'utilisateur à reconnecter
                //console.log("Token décodé: ", decoded)
                req.id = decoded.id
                // Autorise l'accés à la route protégée
                next()
            }
        })
    }
}

module.exports = withAuth
