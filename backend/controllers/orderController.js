// On lie la clé privée stripe au back end pour permettre le suivi du paiement
const sk_test = process.env.STRIPE_API_KEY_TEST
const stripe = require('stripe')(sk_test)

module.exports = (ProductModel, OrderModel, OrderDetailModel, UserModel) => {

    // Fonction de sauvegarde d'une commande dans la BDD
    const saveOrder = async(req, res) => {
        try {
            let totalAmount = 0

            // Enregistrement de la commande initiale sans montant total
            const orderInfos = await OrderModel.saveOneOrder(req.body.user_id, totalAmount)

            // Vérification d'erreur à l'enregistrement de la commande
            if (orderInfos.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de la commande" })
            }
            else {
                // Récupération de l'id de la commande qui vient d'être créé dans la BDD
                const id = orderInfos.insertId
                // On boucle sur le panier pour enregistrer les détails de chaque produit acheté, on utilisera Promise.all pour attendre que toutes les promesses soient résolues avant de renvoyer une réponse (sinon la réponse est envoyée avant que toutes les opérations ne soient terminées)
                const promises = req.body.basket.map(async(element) => {
                    // On récupère les informations du produit par son id
                    const product = await ProductModel.getOneProduct(element.id)
                    // On vérifie s'il y a un code d'erreur dans les informations du produit
                    if (product.code) {
                        return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de la commande, produit non trouvé" })
                    }
                    else {
                        // On ajoute une propriété safePrice au produit du panier (l'objet du tour de boucle) en lui affectant le prix du produit récupéré dans la BDD
                        element.safePrice = parseFloat(product[0].price)

                        // On appelle la fonction de sauvegarde des détails de la commande en envoyant l'id de la commande et le produit du tour de boucle
                        const detail = await OrderDetailModel.saveOneOrderDetails(id, element)

                        // On vérifie s'il y a un code d'erreur dans les détails de la commande
                        if (detail.code) {
                            return res.json({ status: 500, msg: "Erreur lors de l'enregistrement des détails de la commande" })
                        }
                        else {
                            // On calcule le montant total (totalAmount) en multipliant la quantité du produit demandé par le safePrice
                            totalAmount += parseInt(element.quantityInCart) * parseFloat(element.safePrice)
                            
                            await Promise.all(promises)
                            
                            // On met à jour le montant total de la commande dans la BDD
                            const update = await OrderModel.updateTotalAmount(id, totalAmount)
                            // On vérifie s'il y a un code d'erreur lors de cette mise à jour
                            if (update.code) {
                                return res.json({ status: 500, msg: "Erreur lors de la mise à jour du montant total de la commande" })
                            }
                        }
                    }
                })
                // Si tout a réussi on renvoie l'id de la commande
                res.json({ status: 200, orderId: id })
            }
        }
        // Gestion générale des erreurs lors de l'enregistrement de la commande
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement de la commande" })
        }
    }

    // Fonction de gestion du paiement via Stripe (fonction qui va analyser le bon fonctionnenement du paiement)
    const executePayment = async(req, res) => {
        try {
            // On récupère les informations de commande par son id
            const order = await OrderModel.getOneOrder(req.body.orderId)

            // On vérifie s'il y a un code d'erreur lors de la récupération de la commande
            if (order.code) {
                return res.json({ status: 500, msg: "Erreur lors de la vérification de la commande" })
            }
            else {
                // console.log(order[0].totalAmount * 100)
                // On crée une intention de paiement pour le montant total de la commande
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: order[0].totalAmount * 100, // Comme le montant est en centimes on multiplie le montant à payer par 100
                    currency: 'eur', // On indique que la devise du paiement est l'euro
                    metadata: { integration_check: 'accept_a_payment' }, // On utilise les metadonnées pour vérifier si le paiement est valide ou non
                    receipt_email: req.body.email // On envoie une confirmation de paiement par mail à l'utilisateur 
                })
                // console.log(paymentIntent)
                // On renvoie le client_secret pour confirmer le paiement côté client
                res.json({ status: 200, client_secret: paymentIntent['client_secret'] })
            }
        }
        catch (err) {
            // console.log(err)
            // Gestion générale des erreurs
            res.json({ status: 500, msg: "Erreur lors du traitement du paiement" })
        }
    }

    // Fonction de mise à jour du statut du paiement
    const updatePaymentStatus = async(req, res) => {
        try {
            // On met à jour le statut de la commande dans la base de données
            const validate = await OrderModel.updateStatus(req.body.orderId, req.body.status)

            // On vérifie s'il y a un code d'erreur lors de la mise à jour 
            if (validate.code) {
                return res.json({ status: 500, msg: "Le statut de paiement de la commande n'a pas pu être modifié" })
            }
            else {
                res.json({ status: 200, msg: "Le statut de paiement a été mis à jour" })
            }
        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Erreur lors de la mise à jour du statut de paiement" })
        }
    }

    // Fonction de mise à jour du statut d'une commande
    const updateOrderStatus = async(req, res) => {
        try {
            // On met à jour le statut de la commande dans la base de données
            const validate = await OrderModel.updateStatus(req.body.orderId, req.body.status)

            // On vérifie s'il y a un code d'erreur lors de la mise à jour 
            if (validate.code) {
                return res.json({ status: 500, msg: "Le statut de la commande n'a pas pu être modifié" })
            }
            else {
                res.json({ status: 200, msg: "Le statut de la commande a été mis à jour" })
            }
        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Erreur lors de la mise à jour du statut de la commande" })
        }
    }

    // Fonction de récupération de toutes les commandes
    const getAllOrders = async(req, res) => {
        try {
            // On récupère toutes les commandes 
            const orders = await OrderModel.getAllOrders()

            // On vérifie s'il y a un code d'erreur lors de la récupération
            if (orders.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des commandes" })
            }
            else {
                res.json({ status: 200, result: orders })
            }
        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des commandes" })
        }
    }

    // Fonction de récupération d'une commande par son id
    const getOneOrder = async(req, res) => {
        try {
            // Récupération d'une commande par son id
            const order = await OrderModel.getOneOrder(req.params.id)

            // On vérifie s'il y a un code d'erreur lors de la récupération
            if (order.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de la commande" })
            }
            else {
                // On récupère les informations de l'utilisateur qui a passé la commande
                const user = await UserModel.getOneUser(order[0].user_id)

                // On vérifie s'il y a un code d'erreur lors de la récupération des informations
                if (user.code) {
                    return res.json({ status: 500, msg: "Erreur lors de la récupération des informations de l'utilisateur" })
                }
                else {
                    // On crée un objet de user sans informations sensibles
                    const myUser = {
                        firstname: user[0].firstname,
                        lastname: user[0].lastname,
                        address_1: user[0].address_1,
                        address_2: user[0].address_2,
                        zip: user[0].zip,
                        city: user[0].city,
                        phone: user[0].phone
                    }

                    // On récupère les détails de la commande
                    const details = await OrderDetailModel.getAllDetails(req.params.id)

                    // On vérifie s'il y a un code d'erreur dans les détails récupérés
                    if (details.code) {
                        return res.json({ status: 500, msg: "Erreur lors de la récupération des détails de la commande" })
                    }
                    else {
                        // On renvoie les informations de la commande, les détails de la commande et les informations de l'utilisateur qui a passé la commande
                        res.json({ status: 200, order: order[0], user: myUser, orderDetail: details })
                    }
                }
            }

        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Erreur de récupération de la commande" })
        }
    }

    // Fonction de récupération des commandes pour un utilisateur
    const getOneUserOrders = async(req, res) => {
        try {
            // Récupération des commandes
            const orders = await OrderModel.getAllOrdersByUser(req.params.userId)
            if (orders.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des commandes de l'utilisateur" })
            }
            else {
                res.json({ status: 200, orders: orders })
            }
        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Erreur de récupération des commandes de l'utilisateur" })
        }
    }

    return {
        saveOrder,
        executePayment,
        updatePaymentStatus,
        updateOrderStatus,
        getAllOrders,
        getOneOrder,
        getOneUserOrders
    }
}
