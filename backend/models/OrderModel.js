/*
Modèle pour gérer les commandes dans la base de données.
*/

// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return OrderModel
}

class OrderModel {

    // Sauvegarde d'une nouvelle commande avec la date de création, l'identifiant de l'utilisateur, le montant total, les frais de livraison, le poids total et l'identifiant du statut
    static saveOneOrder(userId, totalAmount, shippingCost, totalWeight, statusId) {
        return db.query('INSERT INTO orders (created_at, user_id, total_amount, shipping_cost, total_weight, updated_at, status_id) VALUES (NOW(), ?, ?, ?, ?, NOW(), ?)', [userId, totalAmount, shippingCost, totalWeight, statusId])
            .then((res) => {
                return res // Retourne le résultat de l'insertion
            })
            .catch((err) => {
                return err // Gère les erreurs lors de l'insertion
            })
    }

    // Récupération d'une commande correspondant à un id spécifique, avec les informations de l'utilisateur, les détails de la commande et les produits associés via des jointures LEFT JOIN
    static getOneOrder(id) {
        return db.query(`SELECT orders.*, 
                               users.firstname, users.lastname, users.email, users.address_1, users.address_2, users.zip, users.city, users.phone,
                               order_details.product_id, order_details.quantity, order_details.product_price, 
                               products.name AS product_name
                        FROM orders
                        LEFT JOIN users ON orders.user_id = users.id
                        LEFT JOIN order_details ON orders.id = order_details.order_id
                        LEFT JOIN products ON order_details.product_id = products.id
                        WHERE orders.id = ?`, [id])
            .then((res) => {
                return res // Retourne la commande avec les informations jointes
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Récupération de toutes les commandes avec les informations des utilisateurs via une jointure LEFT JOIN et un tri par date de création de la plus récente à la plus ancienne
    static getAllOrders() {
        return db.query(`SELECT orders.*, 
                                users.firstname, users.lastname, users.email
                            FROM orders
                            LEFT JOIN users ON orders.user_id = users.id
                            ORDER BY created_at DESC`)
            .then((res) => {
                return res // Retourne toutes les commandes avec les utilisateurs associés, par ordre de date
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Récupération de toutes les commandes d'un utilisateur via son identifiant
    static getAllOrdersByUser(userId) {
        return db.query(`SELECT * FROM orders
                            WHERE user_id = ?
                            ORDER BY created_at DESC`, [userId])
            .then((res) => {
                return res // Retourne toutes les commandes de l'utilisateur
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Mise à jour du montant total d'une commande correspondant à un id spécifique
    static updateOrderTotalAmount(ordersId, totalAmount) {
        return db.query('UPDATE orders SET total_amount = ?, updated_at = NOW() WHERE id = ?', [totalAmount, ordersId]) // On met les valeurs dans le même ordre ques les "?" de la requête SQL
            .then((res) => {
                return res // Retourne le résultat de la mise à jour
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la mise à jour
            })
    }

    // Mise à jour du statut d'une commande correspondant à un id spécifique en modifiant l'identifiant du statut
    static updateOrderStatus(orderId, statusId) {
        return db.query('UPDATE orders SET status_id = ?, updated_at = NOW() WHERE id = ?', [statusId, orderId])
            .then((res) => {
                return res // Retourne le résultat de la mise à jour
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la mise à jour
            })
    }
}
