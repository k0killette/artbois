const withAuth = require("../middleware/withAuth")
const withAuthAdmin = require("../middleware/withAuthAdmin")

module.exports = (app, db) => {
    const OrderModel = require("../models/OrderModel")(db)
    const orderController = require("../controllers/orderController")(OrderModel)

    // Route d'enregistrement d'une commande
    app.post("/api/artbois/orders/save", withAuth, orderController.saveOrder)

    // Route de récupération d'une commande
    app.get("/api/artbois/orders/:id", withAuth, orderController.getOneOrder)

    // Route de récupération de toutes les commandes
    app.get("/api/artbois/orders", withAuthAdmin, orderController.getAllOrders)
    
    // Route de récupération des commandes d'un utilisateur
    app.get("/api/artbois/orders/users/:id", withAuth, orderController.getOneUserOrders)

    // Route de gestion du paiement d'une commande
    app.post("/api/artbois/orders/payment", withAuthAdmin, orderController.executePayment)

    // Route de modification du statut de paiement
    app.put("/api/artbois/orders/confirm-payment/:id", withAuth, orderController.updatePaymentStatus)
    
    // Route de modification du statut d'une commande
    app.put("/api/artbois/orders/update-status/:id", withAuthAdmin, orderController.updateOrderStatus)
}
