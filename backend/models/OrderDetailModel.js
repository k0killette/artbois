/*
Modèle pour gérer les détails des commandes dans la base de données.
*/

// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return OrderDetailModel
}

class OrderDetailModel {

    // Sauvegarde des détails (ligne) d'une commande avec l'identifiant du produit, la quantité et le prix du produit figé au moment de la commande
    static saveOneOrderDetails(orderDetails) {
        return db.query(
                'INSERT INTO order_details (order_id, product_id, quantity, product_price) VALUES (?, ?, ?, ?)', [orderDetails.order_id, orderDetails.product_id, orderDetails.quantity, orderDetails.product_price])
            .then((res) => {
                return res // Retourne le résultat de l'insertion
            })
            .catch((err) => {
                return err // Gère les erreurs lors de l'insertion
            })
    }

    // Récupération des détails d'une commande avec le nom du produit et le total de la ligne (product_price * quantity) via une jointure INNER JOIN
    static getAllOrderDetails(orderId) {
        return db.query(`SELECT order_details.*,
                                products.name, 
                                (order_details.product_price * order_details.quantity) AS product_line_total
                        FROM order_details 
                        INNER JOIN products ON products.id = order_details.product_id 
                        WHERE order_details.order_id = ?`, [orderId])
            .then((res) => {
                return res // Retourne les détails de la commande avec les informations jointes
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }
}
