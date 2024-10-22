/*
orderController.js : ce contrôleur gère les opérations liées aux commandes, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

// Utilitaire pour le calcul des frais de livraison en fonction du poids
const shippingCalculator = require('../utils/shippingCalculator')
// Lie la clé privée Stripe au backend pour permettre le suivi du paiement
const sk_test = process.env.STRIPE_API_KEY_TEST
// Stripe pour gérer les paiements
const stripe = require('stripe')(sk_test)

module.exports = (ProductModel, OrderModel, OrderDetailModel) => {

    // Enregistre une commande dans la base de données après le paiement sur Stripe
    const saveOrder = async(req, res) => {
        try {
            // Récupère l'id de l'utilisateur connecté
            const userId = req.body.user_id

            // Initialise les variables pour stocker les différents totaux
            let totalProducts = 0
            let totalAmountProducts = 0
            let totalWeight = 0
            let shippingCost = 0
            let totalAmount = 0

            // Boucle sur le panier pour calculer le nombre total de produits, le montant total et le poids total
            for (const item of req.body.basket) {
                // Appelle le modèle pour récupérer les informations du produit par son id
                const product = await ProductModel.getOneProduct(item.id)
                // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
                if (product.code) {
                    return res.json({ status: 500, msg: "Produit non trouvé" })
                }
                else {
                    // Calcule les totaux pour les produits
                    totalProducts += item.quantityInCart
                    totalAmountProducts += product[0].price * item.quantityInCart
                    // Si le poids du produit n'est pas valide, renvoie un message d'erreur avec un statut 500 (Internal Server Error)
                    if (isNaN(product[0].weight) || product[0].weight === null) {
                        return res.json({ status: 500, msg: `Poids non valide pour le produit ${product[0].name}` })
                    }
                    // Sinon ajoute le poids du produit au poids total
                    else {
                        totalWeight += shippingCalculator.calculateTotalWeight(item.quantityInCart, product[0].weight)
                    }
                }    
            }

            // Calcule les frais de livraison en fonction du poids total
            shippingCost = shippingCalculator.calculateShippingCost(totalWeight)
            // Calcule le montant total de la commande (lignes de produits + frais de livraison)
            totalAmount = totalAmountProducts + shippingCost
            // Définit le statut de la commande à "Payée" avec un status_id = 1
            const statusPaid = 1
            // Appelle le modèle pour enregistrer la commande dans la base de données
            const order = await OrderModel.saveOneOrder(userId, totalAmount, shippingCost, totalWeight, statusPaid)

            // Si l'INSERT INTO échoue, le processus s'arrête et renvoie une erreur avec un statut 500 (Internal Server Error)
            if (order.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de la commande" })
            }
            // Si l'enregistrement de la commande est réussi
            else {
                // Récupère l'id de la commande nouvellement créée
                const orderId = order.insertId

                // Boucle sur le panier pour enregistrer les détails de chaque produit de la commande dans la table order_details et mettre à jour le stock
                // Utilise une boucle for...of pour attendre que chaque tour de boucle soit résolu avant de passer au suivant, cela garantit que toutes les opérations sont terminées avant de continuer
                for (const item of req.body.basket) {
                    // Appelle à nouveau le modèle pour récupérer les informations du produit pour les détails
                    const product = await ProductModel.getOneProduct(item.id)
                    // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
                    if (product.code) {
                        return res.json({ status: 500, msg: "Erreur lors de la récupération du produit pour les détails de la commande" })
                    }
                    // Sinon, procède à l'enregistrement des détails de la commande
                    else {
                        // Appelle le modèle pour enregistrer les détails de la commande dans la base de données
                        const orderDetail = await OrderDetailModel.saveOneOrderDetails({
                            order_id: orderId,
                            product_id: product[0].id,
                            quantity: item.quantityInCart,
                            product_price: product[0].price
                        })
                        // Si une erreur survient lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
                        if (orderDetail.code) {
                            return res.json({ status: 500, msg: "Erreur lors de l'enregistrement des détails de la commande" })
                        }
                        // Sinon, met à jour le stock du produit
                        else {
                            // Met à jour le stock produit
                            const newStock = product[0].stock - item.quantityInCart
                            // Appelle le modèle pour mettre à jour le stock du produit
                            const updateStock = await ProductModel.updateOneProductStock(product[0].id, newStock)
                            // Si une erreur survient lors de la mise à jour du stock, renvoie une réponse avec un statut 500 (Internal Server Error)
                            if (updateStock.code) {
                                return res.json({ status: 500, msg: "Erreur lors de la mise à jour du stock" })
                            }
                        }
                    }    
                }
                // Si tout s'est bien passé, renvoie un message de confirmation et l'id de la commande, le montant total et les frais d'expédition
                res.json({ status: 200, msg: "Commande enregistrée avec succès", orderId: orderId, totalAmount: totalAmount, shippingCost: shippingCost })
            }
        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement de la commande", error: err })
        }
    }

    // Gère le paiement via Stripe (fonction qui va analyser le bon fonctionnement du paiement)
    const executePayment = async(req, res) => {
        try {
            // Appelle le modèle pour récupérer les informations d'une commande par son id
            const order = await OrderModel.getOneOrder(req.body.orderId)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (order.code) {
                return res.json({ status: 500, msg: "Erreur lors de la vérification de la commande" })
            }
            // Sinon si la commande n'a pas été trouvée ou que le montant total n'est pas valide, renvoie une réponse avec un statut 500 (Internal Server Error)
            else if (order.length === 0 || order[0].total_amount === undefined) {
                return res.json({ status: 500, msg: "Le montant de la commande n'est pas valide" })
            }
            // Sinon tout est correct, on procède au paiement
            else {
                // Récupère le montant total de la commande
                const totalAmount = order[0].total_amount
                // Si le montant n'est pas un nombre valide ou est inférieur ou égal à zéro, renvoie une réponse avec un statut 500 (Internal Server Error)
                if (isNaN(totalAmount) || totalAmount <= 0) {
                    return res.json({ status: 500, msg: "Montant de la commande invalide" })
                }
                // Sinon le montant est valide
                else {
                    // Passe le montant en centimes pour Stripe et arrondit le montant pour éviter les imprécisions (Stripe attend un integer)
                    const amountInCents = Math.round(totalAmount * 100)
                    // Crée une intention de paiement pour le montant total de la commande
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: amountInCents,
                        currency: 'eur', // Indique que la devise du paiement est l'euro
                        metadata: { integration_check: 'accept_a_payment' }, // Utilise les metadonnées pour vérifier si le paiement est valide ou non
                        receipt_email: req.body.email // Envoie une confirmation de paiement par mail à l'utilisateur 
                    })
                    
                    // Renvoie le client_secret pour confirmer le paiement côté client avec un statut 200 (OK)
                    res.json({ status: 200, client_secret: paymentIntent['client_secret'] })
                }
            }
        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Echec du traitement du paiement" })
        }
    }

    // Met à jour le statut d'une commande
    const updateOrderStatus = async(req, res) => {
        try {
            // Appelle le modèle pour mettre à jour le statut de la commande
            const validate = await OrderModel.updateOrderStatus(req.body.orderId, req.body.statusId)
            // Si une erreur survient lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (validate.code) {
                return res.json({ status: 500, msg: "Le statut de la commande n'a pas pu être modifié" })
            }
            // Si la mise à jour est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Le statut de la commande a été mis à jour" })
            }
        }
        // Gestion des erreurs lors de la mise à jour
        catch (err) {
            res.json({ status: 500, msg: "Erreur lors de la mise à jour du statut de la commande" })
        }
    }

    // Récupère toutes les commandes
    const getAllOrders = async(req, res) => {
        try {
            // Appelle le modèle pour récupérer toutes les commandes 
            const orders = await OrderModel.getAllOrders()
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (orders.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des commandes" })
            }
            // Sinon renvoie la réponse avec les commandes trouvées avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: orders })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des commandes" })
        }
    }

    // Récupère une commande par son id
    const getOneOrder = async(req, res) => {
        try {
            // Appelle le modèle pour récupérer la commande par son id (avec les informations del'utilisateur et les détails de la commande grâce à une seule requête SQL avec jointures)
            const order = await OrderModel.getOneOrder(req.params.id)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (order.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de la commande" })
            }
            // Sinon renvoie la réponse avec les informations de la commande avec un statut 200 (OK)
            else {
                res.json({ status: 200, order: order[0] })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération de la commande" })
        }
    }

    // Récupère les commandes d'un utilisateur
    const getOneUserOrders = async(req, res) => {
        try {
            // Appelle le modèle pour récupérer toutes les commandes d'un utilisateur
            const orders = await OrderModel.getAllOrdersByUser(req.params.userId)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (orders.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des commandes de l'utilisateur" })
            }
            // Sinon renvoie la réponse avec les commandes trouvées avec un statut 200 (OK)
            else {
                res.json({ status: 200, orders: orders })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération des commandes de l'utilisateur" })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveOrder,
        executePayment,
        updateOrderStatus,
        getAllOrders,
        getOneOrder,
        getOneUserOrders
    }
}
