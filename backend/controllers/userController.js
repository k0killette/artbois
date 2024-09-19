const bcrypt = require('bcryptjs')
const saltRounds = 10 // Saler un mot de passe signifie lui ajouter des caractères aléatoires au moment de la génération du hash de sorte à rendre chaque hashage quasi-unique : ainsi deux mots de passe identiques n'auront pas le même hash
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

module.exports = (UserModel) => {

    // Sauvegarde d'un utilisateur
    const saveUser = async(req, res) => {
        try {
            // On vérifie si un utilisateur dans la BDD possède déjà un compte avec cet email (on évite les doublons)
            const check = await UserModel.getOneUserByEmail(req.body.email)
            if (check.code) {
                res.json({ status: 500, msg: "Erreur lors de la vérification de l'email" })
            }
            else {
                // Si check retourne un tableau qui n'est pas vide, il existe déjà un utilisateur pour cet email et on retourne une erreur
                if (check.length > 0) {
                    res.json({ status: 401, msg: "Un compte avec cet email existe déjà" })
                }
                // Sinon on enregistre l'utilisateur
                else {
                    const user = await UserModel.saveOneUser(req)
                    if (user.code) {
                        res.json({ status: 500, msg: "Erreur lors de l'enregistrement de l'utilisateur" })
                    }
                    else {
                        res.json({ status: 200, msg: "Utilisateur enregistré" })
                    }
                }
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement de l'utilisateur" })
        }
    }

    // Récupération d'un utilisateur par son id
    const getOneUser = async(req, res) => {
        try {
            const user = await UserModel.getOneUser(req.params.id)
            if (user.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération de l'utilisateur" })
            }
            else if (user.length === 0) {
                res.json({ status: 404, msg: "Utilisateur introuvable" })
            }
            else {
                res.json({ status: 200, user: user[0] })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération de l'utilisateur" })
        }
    }

    // Récupération de tous les utilisateurs 
    const getAllUsers = async(req, res) => {
        try {
            const users = await UserModel.getAllUsers()
            if (users.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération des utilisateurs" })
            }
            else {
                res.json({ status: 200, users: users })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des utilisateurs" })
        }
    }

    // Connexion à un compte utilisateur
    const loginUser = async(req, res) => {
        try {
            // On vérifie si le champs email est bien rempli
            if (req.body.email === "") {
                return res.json({ status: 401, msg: "Veuillez saisir une adresse e-mail" })
            }
            else {
                // On vérifie si un utilisateur dans la BDD possède un compte avec cet email
                const check = await UserModel.getOneUserByEmail(req.body.email)
                if (check.code) {
                    res.json({ status: 500, msg: "Erreur lors de la vérification de l'email" })
                }
                else {
                    // Si aucun compte n'existe avec cet email on retourne un message d'erreur
                    if (check.length === 0) {
                        res.json({ status: 404, msg: "Utilisateur introuvable" })
                    }
                    // Sinon on compare les mots de passe
                    else {
                        const same = await bcrypt.compare(req.body.password, check[0].password)
                        // Si c'est true, les mots de passe correspondent
                        if (same) {
                            // On crée le payload du token (= valeurs qu'on va glisser dans le token... ATTENTION, ON NE MET PAS D'INFORMATIONS SENSIBLES !)
                            const payload = { id: check[0].id, role: check[0].role }
                            // On crée notre algorithme (token) en stockant les valeurs et en vérouillant avec le secret
                            const token = jwt.sign(payload, secret)
                            // On prépare les informations utilisateur pour les renvoyer vers le front avec le token
                            const user = {
                                id: check[0].id,
                                firstname: check[0].firstname,
                                lastname: check[0].lastname,
                                email: check[0].email,
                                address_1: check[0].address_1,
                                address_2: check[0].address_2,
                                zip: check[0].zip,
                                city: check[0].city,
                                phone: check[0].phone,
                                role: check[0].role
                            }
                            res.json({ status: 200, token: token, user: user })
                        }
                        // Sinon c'est false, les mots de passes ne correspondent pas
                        else {
                            res.json({ status: 404, msg: "Mot de passe incorrect" })
                        }
                    }
                }
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la connexion" })
        }
    }

    // Mise à jour de l'utilisateur    
    const updateUser = async(req, res) => {
        try {
            const updatedUser = await UserModel.updateOneUser(req, req.params.id)
            if (updatedUser.code) {
                res.json({ status: 500, msg: "Erreur lors de la mise à jour de l'utilisateur" })
            }
            // On renvoie les informations mises à jour vers le front
            else {
                const newUser = await UserModel.getOneUser(req.params.id)
                if (newUser.code) {
                    res.json({ status: 500, msg: "Erreur lors de la récupération de l'utilisateur" })
                }
                else {
                    const myUser = {
                        id: newUser[0].id,
                        firstname: newUser[0].firstname,
                        lastname: newUser[0].lastname,
                        email: newUser[0].email,
                        address_1: newUser[0].address_1,
                        address_2: newUser[0].address_2,
                        zip: newUser[0].zip,
                        city: newUser[0].city,
                        phone: newUser[0].phone,
                        role: newUser[0].role
                    }
                    res.json({ status: 200, msg: "Utilisateur mis à jour", newUser: myUser })
                }
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la mise à jour du profil utilisateur" })
        }
    }

    const deleteUser = async(req, res) => {
        try {
            const deletedUser = await UserModel.deleteOneUser(req.params.id)
            if (deletedUser.code) {
                res.json({ status: 500, msg: "Erreur lors de la suppression de l'utilisateur" })
            }
            else {
                res.json({ status: 200, msg: "Utilisateur supprimé" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la suppression de l'utilisateur" })
        }
    }

    return {
        saveUser,
        getOneUser,
        getAllUsers,
        loginUser,
        updateUser,
        deleteUser
    }
}
