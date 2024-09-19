const jwt = require("jsonwebtoken")
const secret = process.env.SECRET

const withAuthAdmin = (req, res, next) => {
    // Récupération du token JWT dans le header de la requète HTTP (utilisé pour vérifier l'authentification)
    const token = req.headers['x-access-token']

    // Si le token n'est pas trouvé, on renvoie une erreur
    if (token === undefined) {
        return res.json({ status: 404, msg: "Erreur, le token n'a pas été trouvé" })
    }
    // Sinon (le token a été trouvé) on utilise la fonction de vérification de jsonwebtoken
    else {
        jwt.verify(token, secret, (err, decoded) => {
            // Si le token est invalide ou a expiré, on renvoie une erreur 401 (non autorisé)
            if (err) {
                return res.json({ status: 401, msg: "Erreur, le token n'est pas valide" })
            }
            // Le token est vérifié et valide
            else {
                // Si le rôle de l'utilisateur n'est pas admin, on renvoie une erreur 403 (interdiction d'accès)
                if (decoded.role !== "admin") {
                    return res.json({ status: 403, msg: "Erreur, accès restreint aux administrateurs" })
                }
                // Sinon s'il est admin
                else {
                    // On ajoute l'id de l'utilisateur dans la requête
                    req.id = decoded.id
                    // On appelle next() pour sortir de la fonction, on autorise l'accés à la callback de la route protégée
                    next()
                }
            }
        })
    }
}

module.exports = withAuthAdmin
