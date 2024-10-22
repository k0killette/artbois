/*
orderDetailController.js : ce contrôleur gère les opérations liées aux détails des lignes des commandes, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

module.exports = (OrderDetailModel, ProductModel) => {

    // Enregistre un nouveau détail de commande
    const saveOrderDetails = async(req, res) => {
        try {
            // Récupère l'id de la commande et les détails des produits depuis la requête
            const { orderId, productDetails } = req.body
            // Si les données ne sont pas présentes ou productDetails n'est pas un tableau, renvoie un message avec un statut 400 (Bad Request)
            if (!orderId || !productDetails || !Array.isArray(productDetails)) {
                return res.json({ status: 400, msg: "Données invalides ou manquantes" })
            }
            // Sinon, procède à l'enregistrement des détails de la commande
            else {
                // Boucle sur chaque produit et enregistre les détails dans la base de données
                for (const detail of productDetails) {
                    // Appelle le modèle pour vérifier que le produit existe bien dans la base de données
                    const product = await ProductModel.getOneProduct(detail.productId)
                    // Si le produit n'existe pas, renvoie une erreur 404 (Not Found)
                    if (!product || product.length === 0) {
                        return res.json({ status: 404, msg: `Produit avec l'ID ${detail.productId} non trouvé` });
                    }
                    // Crée un objet avec les informations à enregistrer pour chaque détail de produit
                    const orderDetail = {
                        order_id: orderId,
                        product_id: detail.productId,
                        quantity: detail.quantity,
                        product_price: detail.price
                    }
                    // Appelle le modèle pour enregistrer les détails de la commande
                    const result = await OrderDetailModel.saveOneOrderDetails(orderDetail)
                    // Si une erreur survient lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
                    if (result.code) {
                        res.json({ status: 500, msg: "Erreur lors de l'enregistrement des détails de la commande" })
                    }
                }
                // Si l'enregistrement est réussi pour tous les détails, renvoie une réponse avec un statut 200 (OK)
                res.json({ status: 200, msg: "Détails de la commande enregistrés" })
            }
        }
        // Gestion des erreurs globales lors de l'enregistrement
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement des détails de la commande", error: err })
        }
    }

    // Récupère un détail de commande
    const getOrderDetails = async(req, res) => {
        try {
            // Appelle le modèle pour récupérer les détails d'une commande par son id
            const orderDetails = await OrderDetailModel.getAllOrderDetails(req.params.orderId)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (orderDetails.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération des détails de la commande" })
            }
            // Sinon renvoie la réponse avec les détails de commande trouvés avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: orderDetails })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des détails de la commande", error: err })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveOrderDetails,
        getOrderDetails
    }
}
