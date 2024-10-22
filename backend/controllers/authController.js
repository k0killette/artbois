/*
authController.js : ce contrôleur gère l'authentification et la vérification des tokens JWT pour les utilisateurs.
*/

module.exports = (UserModel) => {
    
    // Vérifie le token JWT et renvoie les informations utilisateur si le token est valide
    const checkToken = async(req, res) => {
        try {
            // Récupère les informations de l'utilisateur à partir de son id
            const user = await UserModel.getOneUser(req.id)
            
            // Vérifie s'il y a un code d'erreur dans l'objet user
            if (user.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des informations utilisateur" })
            }
            
            // Vérifie si user est null ou undefined ou si la réponse est vide (l'utilisateur n'a pas été trouvé)
            else if (!user || user.length === 0) {
                return res.json({ status: 404, msg: "Utilisateur introuvable"})
            }
            
            // Si l'utilisateur est trouvé, récupère dans un objet les données de l'utilisateur
            else {
                const myUser = {
                    id: user[0].id,
                    firstname: user[0].firstname,
                    lastname: user[0].lastname,
                    email: user[0].email,
                    address_1: user[0].address_1,
                    address_2: user[0].address_2,
                    zip: user[0].zip,
                    city: user[0].city,
                    phone: user[0].phone,
                    role: user[0].role
                }
                // Renvoie la réponse avec les données récupérées
                return res.json({ status: 200, user: myUser })
            }
        }
        // Gestion des erreurs lors de la vérification du token
        catch (err) {
            return res.json({ status: 500, msg: "Problème de token lors de l'authentification" })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        checkToken
    }
}
