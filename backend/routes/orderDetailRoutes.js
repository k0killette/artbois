const withAuth = require("../middleware/withAuth")
const withAuthAdmin = require("../middleware/withAuthAdmin")

module.exports = (app, db) => {
    const OrderModel = require("../models/OrderModel")(db)
    const OrderDetailModel = require("../models/OrderDetailModel")(db)
    const orderDetailController = require("../controllers/orderDetailController")(OrderModel, OrderDetailModel)

    // Route d'enregistrement des détails d'une commande
    app.post("/api/artbois/orders/details", withAuth, orderDetailController.saveOrderDetails)

    // Route de récupération des détails d'une commande
    app.get("/api/artbois/orders/details/:id", withAuth, orderDetailController.getOrderDetails)
}
