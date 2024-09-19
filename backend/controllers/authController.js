module.exports = (UserModel) => {
    const checkToken = async(req, res) => {
        try {
            // On récupère les informations de l'utilisateur à partir de son id
            const user = await UserModel.getOneUser(req.id)
            
            // On vérifie s'il y a un code d'erreur dans l'objet user
            if (user.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des informations utilisateur" })
            }
            
            // On vérifie si user est null ou undefined ou si la réponse est vide
            else if (!user || user.length === 0) {
                return res.json({ status: 404, msg: "Utilisateur introuvable"})
            }
            
            // S'il n'y a aucune erreur on récupère les données de l'utilisateur
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
                return res.json({ status: 200, user: myUser })
            }
        }
        catch (err) {
            // Si erreur 
            return res.json({ status: 500, msg: "Problème de token lors de l'authentification" })
        }
    }
    
    // On retourne l'objet avec la méthode checkToken
    return {
        checkToken
    }
}
