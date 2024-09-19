module.exports = (_db) => {
    db = _db
    return OrderModel
}

class OrderModel {

    // Sauvegarde d'une commande
    static saveOneOrder(usersId, totalAmount) {
        // Par défaut le statut de la commande est "Payée"
        return db.query('INSERT INTO orders (date, status, total_amount, users_id, updated_at) VALUES (NOW(), "Payée", ?, ?, NOW())', [totalAmount, usersId])
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
            })
    }

    // Récupération d'une commande à partir de son id avec jointure sur les détails de commande, les détails de produits et l'utilisateur ayant passé la commande
    static getOneOrder(id) {
        return db.query(`SELECT orders.*,  
                                order_details.*,
                                products.name AS product_name, products.price AS product_price, 
                                users.firstname, users.lastname, users.email, users.address_1, users.address_2, users.zip, users.city, users.phone, users.role 
                        FROM orders 
                        LEFT JOIN order_details ON orders.id = order_details.orders_id
                        LEFT JOIN products ON order_details.products_id = products.id
                        LEFT JOIN users ON orders.users_id = users.id 
                        WHERE orders.id = ?`, [id])
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
            })
        }

        // Récupération de toutes les commandes avec jointure sur les utilisateurs
        static getAllOrders() {
            return db.query(`SELECT orders.*, 
                                    users.firstname, users.lastname, users.email
                            FROM orders
                            LEFT JOIN users ON orders.users_id = users.id`)
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    return err
                })
        }

        // Récupération de toutes les commandes d'un utilisateur
        static getAllOrdersByUser() {
            return db.query(`SELECT * FROM orders
                            WHERE users_id = ?
                            ORDER BY date DESC`)
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    return err
                })
        }        

        // Mise à jour du montant total d'une commande
        static updateTotalAmount(ordersId, totalAmount) {
            return db.query('UPDATE orders SET total_amount = ?, updated_at = NOW() WHERE id = ?', [totalAmount, ordersId]) // On met les valeurs dans le même ordre ques les "?" de la requête SQL
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    return err
                })
        }

        // Mise à jour du statut d'une commande 
        static updateStatus(ordersId, status) {
            return db.query('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, ordersId])
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    return err
                })
        }
    }
