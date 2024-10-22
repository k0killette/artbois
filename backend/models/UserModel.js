/*
Modèle pour gérer les utilisateurs dans la base de données.
*/

const bcrypt = require('bcryptjs') // Utilisé pour le hashage des mots de passe
const saltRounds = 10 // Nombre de rounds pour saler les mots de passe
// Saler un mot de passe signifie lui ajouter des caractères aléatoires au moment de la génération du hash de sorte à rendre chaque hashage quasi-unique : ainsi deux mots de passe identiques n'auront pas le même hash

// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return UserModel
}

class UserModel {

    // Sauvegarde d'un nouvel utilisateur avec hashage du mot de passe
    static saveOneUser(req) {
        // Vérifie d'abord si l'utilisateur a accepté les conditions générales
        if (!req.body.terms_accepted) {
            return Promise.reject({ message: "Vous devez accepter les Conditions Générales d'Utilisation et la Politique de Confidentialité" })
        }
        // Hashage du mot de passe avant la sauvegarde
        return bcrypt.hash(req.body.password, saltRounds)
            .then((hash) => {
                // Sauvegarde de l'utilisateur dans la BDD avec le mot de passe hashé et un rôle "user" par défaut
                return db.query('INSERT INTO users (firstname, lastname, email, password, address_1, address_2, zip, city, phone, role, terms_accepted, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "user", ?, NOW())', [req.body.firstname, req.body.lastname, req.body.email, hash, req.body.address_1, req.body.address_2, req.body.zip, req.body.city, req.body.phone, req.body.terms_accepted])
                    .then((res) => {
                        return res // Retourne le résultat de l'insertion
                    })
                    .catch((err) => {
                        return err // Gère les erreurs lors de l'insertion
                    })
            })
            .catch(err => err) // Gère les erreurs lors du hashage du mot de passe
    }

    // Récupération d'un utilisateur correspondant à un id spécifique, avec ses commandes passées via une jointure LEFT JOIN
    static getOneUser(id) {
        return db.query(`SELECT users.*, 
                                orders.id AS order_id, 
                                orders.created_at AS order_date, 
                                orders.total_amount AS order_amount, 
                                orders.shipping_cost AS order_shipping, 
                                orders.total_weight AS order_weight, 
                                orders.updated_at AS order_update, 
                                orders.status_id AS order_status
                        FROM users 
                        LEFT JOIN orders ON users.id = orders.user_id 
                        WHERE users.id = ?`, [id])
            .then((res) => {
                return res // Retourne l'utilisateur avec ses commandes associées
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Récupération d'un utilisateur correspondant à une adresse e-mail spécifique
    static getOneUserByEmail(email) {
        return db.query('SELECT * FROM users WHERE email = ?', [email])
            .then((res) => {
                return res // Retourne l'utilisateur associé à cet e-mail
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Récupération de tous les utilisateurs 
    static getAllUsers() {
        return db.query('SELECT * FROM users')
            .then((res) => {
                return res // Retourne tous les utilisateurs
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Mise à jour d'un utilisateur correspondant à un id spécifique
    static updateOneUser(req, id) {
        // Si un nouveau mot de passe est fourni, on le hashe avant de mettre à jour l'utilisateur
        if (req.body.password) {
            return bcrypt.hash(req.body.password, saltRounds)
                .then((hash) => {
                    return db.query(
                        'UPDATE users SET firstname = ?, lastname = ?, password = ?, address_1 = ?, address_2 = ?, zip = ?, city = ?, phone = ? WHERE id = ?', [req.body.firstname, req.body.lastname, hash, req.body.address_1, req.body.address_2, req.body.zip, req.body.city, req.body.phone, id])
                    .then((res) => {
                        return res // Retourne le résultat de la mise à jour
                    })
                    .catch((err) => {
                        return err // Gère les erreurs lors de la mise à jour
                    })
                })
        }
        // Mise à jour sans changement de mot de passe
        else {
            return db.query('UPDATE users SET firstname = ?, lastname = ?, address_1 = ?, address_2 = ?, zip = ?, city = ?, phone = ? WHERE id = ?', [req.body.firstname, req.body.lastname, req.body.address_1, req.body.address_2, req.body.zip, req.body.city, req.body.phone, id])
                .then((res) => {
                    return res // Retourne le résultat de la mise à jour
                })
                .catch((err) => {
                    return err // Gère les erreurs lors de la mise à jour
                })
        }
    }

    // Suppression d'un utilisateur correspondant à un id spécifique
    static deleteOneUser(id) {
        return db.query('DELETE FROM users WHERE id = ?', [id])
            .then((res) => {
                return res // Retourne le résultat de la suppression
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la suppression
            })
    }
}
