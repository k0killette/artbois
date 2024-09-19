const jwt = require('jsonwebtoken')
const secret = process.env.SECRET
//console.log("Secret withAuth:", secret) // Devrait afficher la clé secrète

// Middleware qui va autoriser ou non la reconnexion automatique d'un user, ou autoriser ou non l'accès à certaines routes protégées
const withAuth = (req, res, next) => {
    // Récupération du token JWT dans le header de la requète AJAX HTTP (utilisé pour vérifier l'authentification)
    const token = req.headers['x-access-token'] // On peut aussi utiliser Bearer-token
    //console.log("Token reçu:", token) // Vérification du token reçu

    // Si le token n'est pas trouvé, on renvoie une erreur
    if (token === undefined) {
        return res.json({ status: 404, msg: "Erreur, token introuvable" })
    }
    // Sinon (le token a été trouvé) on utilise la fonction de vérification de jsonwebtoken
    else {
        jwt.verify(token, secret, (err, decoded) => {
            // Si le token est invalide ou a expiré, on renvoie une erreur 401 (non autorisé)
            if (err) {
                console.log("Erreur lors de la vérification du token:", err)
                return res.json({ status: 401, msg: "Erreur, token invalide" })
            }
            // Le token est vérifié et valide
            else {
                // On ajoute la propriété id de l'utilisateur décodé dans la requête, pour nous permettre de récupérer les informations de l'utilisateur à reconnecter
                //console.log("Token décodé:", decoded)
                req.id = decoded.id
                // On appelle next() pour sortir de la fonction, on autorise l'accés à la callback de la route protégée
                next()
            }
        })
    }
}

module.exports = withAuth
