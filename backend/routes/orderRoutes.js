/* 
Ce fichier gère les routes pour la gestion des commandes, des statuts des commandes et des détails des commandes.
*/

// Importation du middleware withAuth qui protège certaines routes en autorisant uniquement les utilisateurs authentifiés à y accéder
const withAuth = require('../middleware/withAuth')
// Importation du middleware withAuthAdmin qui protège certaines routes en autorisant uniquement les administrateurs authentifiés à y accéder
const withAuthAdmin = require('../middleware/withAuthAdmin')
// Importation du fichier utilitaire pour le calcul des frais de livraison 
const shippingCalculator = require('../utils/shippingCalculator')

module.exports = (app, db) => {
    // Importation des modèles pour la gestion des statuts de commande, des commandes, des détails de commandes et des produits
    const OrderStatusModel = require('../models/OrderStatusModel')(db)
    const OrderModel = require('../models/OrderModel')(db)
    const OrderDetailModel = require('../models/OrderDetailModel')(db)
    const ProductModel = require('../models/ProductModel')(db)
    
    // Importation des contrôleurs pour la gestion des statuts de commande, des commandes et des détails de commandes
    const orderStatusController = require('../controllers/orderStatusController')(OrderStatusModel)
    const orderController = require('../controllers/orderController')(ProductModel, OrderModel, OrderDetailModel)
    const orderDetailController = require('../controllers/orderDetailController')(OrderDetailModel)

    { /* ORDER STATUS ROUTES */ }

    // (vérifiée)
    // Route d'enregistrement d'un statut de commande avec accès limité aux administrateurs authentifiés
    app.post('/api/artbois/order-statuses', withAuthAdmin, orderStatusController.saveOrderStatus)

    // (vérifiée)
    // Route de récupération de tous les statuts de commande
    app.get('/api/artbois/order-statuses', orderStatusController.getAllOrderStatuses)

    // (vérifiée)
    // Route de récupération d'un statut avec ses commandes associées
    app.get('/api/artbois/order-statuses/:orderStatusId/orders', orderStatusController.getOneOrderStatusWithOrders)

    // (vérifiée)
    // Route de récupération d'un statut de commande
    app.get('/api/artbois/order-statuses/:id', orderStatusController.getOneOrderStatus)

    // (vérifiée)
    // Route de modification d'un statut de commande avec accès limité aux administrateurs authentifiés
    app.put('/api/artbois/order-statuses/:id', withAuthAdmin, orderStatusController.updateOrderStatus)

    // (vérifiée)
    // Route de suppression d'un statut de commande avec accès limité aux administrateurs authentifiés
    app.delete('/api/artbois/order-statuses/:id', withAuthAdmin, orderStatusController.deleteOrderStatus)

    { /* ORDER ROUTES */ }

    // (vérifiée)
    // Route d'enregistrement d'une commande avec accès limité aux utilisateurs authentifiés
    app.post('/api/artbois/orders', withAuth, orderController.saveOrder)

    // (vérifiée) 
    // Route de récupération de toutes les commandes avec accès limité aux administrateurs authentifiés
    app.get('/api/artbois/orders', withAuthAdmin, orderController.getAllOrders)

    // (vérifiée)
    // Route de récupération des commandes d'un utilisateur avec accès limité aux utilisateurs authentifiés
    app.get('/api/artbois/orders/users/:userId', withAuth, orderController.getOneUserOrders)

    // (vérifiée)
    // Route de récupération d'une commande avec accès limité aux utilisateurs authentifiés
    app.get('/api/artbois/orders/:id', withAuth, orderController.getOneOrder)

    // (vérifiée)
    // Route de gestion du paiement d'une commande avec accès limité aux administrateurs authentifiés
    app.post('/api/artbois/orders/payment', withAuthAdmin, orderController.executePayment)

    // (vérifiée)
    // Route de modification du statut d'une commande avec accès limité aux administrateurs authentifiés
    app.put('/api/artbois/orders/status/:orderId', withAuthAdmin, orderController.updateOrderStatus)

    { /* ORDER DETAIL ROUTES */ }

    // (vérifiée)
    // Route d'enregistrement des détails d'une commande avec accès limité aux utilisateurs authentifiés
    app.post('/api/artbois/order-details', withAuth, orderDetailController.saveOrderDetails)
    
    // (vérifiée)
    // Route de récupération des détails d'une commande avec accès limité aux utilisateurs authentifiés
    app.get('/api/artbois/order-details/:orderId', withAuth, orderDetailController.getOrderDetails)
}
