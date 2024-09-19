// On importe la fonction utilitaire de calcul des frais de port
const shippingCalculator = require('../utils/shippingCalculator')

module.exports = (_db) => {
    db = _db
    return OrderDetailModel
}

class OrderDetailModel {

    // Sauvegarde des détails d'une commande
    static saveOneOrderDetails(orderDetails) {

        // Calcul du poids total de la commande
        const totalWeight = shippingCalculator.calculateTotalWeight(orderDetails.quantityInCart, orderDetails.productWeight)

        // Calcul des frais d'expédition
        const shippingCost = shippingCalculator.calculateShippingCost(totalWeight)
        
        // Requête SQL pour insérer les détails d'une commande
        return db.query(
                'INSERT INTO order_details (orders_id, products_id, total_weight, shipping_cost) VALUES (?, ?, ?, ?)', [orderDetails.orders_id, orderDetails.products_id, totalWeight, shippingCost]
            )
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
            })
    }

    // Récupération des détails d'une commande
    static getAllOrderDetails(ordersId) {
        return db.query(`SELECT order_details.id, order_details.products_id, order_details.total_weight, order_details.shipping_cost, 
                            products.name, products.price
                    FROM order_details 
                    INNER JOIN products ON products.id = order_details.products_id 
                    WHERE order_details.orders_id = ?`, [ordersId])
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err
            })
    }
}
