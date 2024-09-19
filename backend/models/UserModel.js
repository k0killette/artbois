const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = (_db) => {
    db = _db
    return UserModel
}

class UserModel {
    
    // Sauvegarde d'un utilisateur avec hashage du mot de passe
    static saveOneUser(req) {
        // On hashe d'abord le mot de passe
        return bcrypt.hash(req.body.password, saltRounds)
            .then((hash) => {
                // Puis on enregistre l'utilisateur dans la base de données, par défaut son rôle est "user"
                return db.query('INSERT INTO users (firstname, lastname, email, password, address_1, address_2, zip, city, phone, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "user", NOW())', [req.body.firstname, req.body.lastname, req.body.email, hash, req.body.address_1, req.body.address_2, req.body.zip, req.body.city, req.body.phone])
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    return err
                })
            })
            .catch(err => err)
    }

    // Récupération d'un utilisateur par son id, avec ses commandes passées
    static getOneUser(id) {
        return db.query(`SELECT users.*, 
                                orders.id AS order_id, orders.date, orders.status, orders.total_amount 
                        FROM users 
                        LEFT JOIN orders ON users.id = orders.users_id 
                        WHERE users.id = ?`, [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    // Récupération d'un utilisateur en fonction de son mail
    static getOneUserByEmail(email) {
        return db.query('SELECT * FROM users WHERE email = ?', [email])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }

    // Récupération de tous les utilisateurs 
    static getAllUsers() {
        return db.query('SELECT * FROM users')
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    // Modification d'un utilisateur par son id
    static updateOneUser(req, id) {
        return db.query('UPDATE users SET firstname = ?, lastname = ?, address_1 = ?, address_2 = ?, zip = ?, city = ?, phone = ? WHERE id = ?', [req.body.firstname, req.body.lastname, req.body.address_1, req.body.address_2, req.body.zip, req.body.city, req.body.phone, id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    // Suppression d'un compte utilisateur
    static deleteOneUser(id) {
        return db.query('DELETE FROM users WHERE id = ?', [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
}
