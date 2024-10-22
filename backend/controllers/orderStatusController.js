/*
orderStatusController.js : ce contrôleur gère les opérations liées aux statuts des commandes, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

module.exports = (OrderStatusModel) => {

    // Enregistre un nouveau statut de commande
    const saveOrderStatus = async(req, res) => {
        try {
            // Appel au modèle pour enregistrer le statut
            const status = await OrderStatusModel.saveOneOrderStatus(req)
            // Si une erreur survient lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (status.code) {
                res.json({ status: 500, msg: "Erreur lors de l'enregistrement du statut de commande" })
            } 
            // Si l'enregistrement est réussi, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Statut de commande enregistré" })
            }
        } 
        // Gestion des erreurs globales lors de l'enregistrement
        catch (err) {
            res.json({ status: 500, msg: "Échec de l'enregistrement du statut de commande" })
        }
    }

    // Récupère un statut de commande
    const getOneOrderStatus = async(req, res) => {
        try {
            // Appel au modèle pour récupérer le statut par son id
            const status = await OrderStatusModel.getOneOrderStatus(req.params.id)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (status.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération du statut de commande" })
            } 
            // Sinon renvoie la réponse avec le statut de commande trouvé avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: status[0] })
            }
        } 
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Échec de la récupération du statut de commande" })
        }
    }

    // Récupère tous les statuts de commande
    const getAllOrderStatuses = async(req, res) => {
        try {
            // Appel au modèle pour récupérer tous les statuts
            const statuses = await OrderStatusModel.getAllOrderStatuses()
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (statuses.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des statuts de commande" })
            } 
            // Sinon renvoie la réponse avec tous les statuts avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: statuses })
            }
        } 
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Échec de la récupération des statuts de commande" })
        }
    }

    // Récupère un statut de commande avec ses commandes associées
    const getOneOrderStatusWithOrders = async(req, res) => {
        try {
            // Appel au modèle pour récupérer un statut avec ses commandes associées
            const orderStatusWithOrder = await OrderStatusModel.getOneOrderStatusWithOrders(req.params.orderStatusId)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (orderStatusWithOrder.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération du statut avec ses commandes" })
            }
            // Crée un objet pour stocker le statut et les commandes associées
            else {
                // Initialise l'objet status pour contenir le statut et les commandes associées
                let status = {}
                // Si le statut existe et a des commandes associées
                if (orderStatusWithOrder.length > 0) {
                    // Récupère l'id du statut et son nom, et crée un tableau des commandes associées
                    status = {
                        id: orderStatusWithOrder[0].id,
                        status_name: orderStatusWithOrder[0].name,
                        order: orderStatusWithOrder
                            .map(order => ({
                                id: order.order_id
                            })) // Boucle sur les commandes associées au statut pour créer un tableau avec les ids
                            .filter(order => order.id) // Filtre les commandes valides (celles avec un id)
                    }
                }
                // Si le statut n'a pas de commande associée ou n'existe pas
                else {
                    // Appel au modèle pour récupérer les détails du statut
                    const orderStatusDetails = await OrderStatusModel.getOneOrderStatus(req.params.orderStatusId)
                    // Stocke les informations du statut sans commande
                    status = {
                        id: orderStatusDetails[0].id,
                        name: orderStatusDetails[0].name,
                        order: [] // Tableau vide, aucune commande associée
                    }
                }
                // Renvoie la réponse avec le statut et ses commandes (ou vide) avec un statut 200 (OK)
                res.json({ status: 200, result: status })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération du statut avec ses commandes" })
        }
    }
    
    // Met à jour un statut de commande
    const updateOrderStatus = async(req, res) => {
        try {
            // Appel au modèle pour mettre à jour le statut
            const updatedStatus = await OrderStatusModel.updateOneOrderStatus(req, req.params.id)
            // Si une erreur survient lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (updatedStatus.code) {
                res.json({ status: 500, msg: "Erreur lors de la mise à jour du statut de commande" })
            } 
            // Si la mise à jour est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Statut de commande mis à jour" })
            }
        } 
        // Gestion des erreurs lors de la mise à jour
        catch (err) {
            res.json({ status: 500, msg: "Échec de la mise à jour du statut de commande" })
        }
    }

    // Supprime un statut de commande
    const deleteOrderStatus = async(req, res) => {
        try {
            // Appel au modèle pour supprimer le statut
            const deletedStatus = await OrderStatusModel.deleteOneOrderStatus(req.params.id)
            // En cas d'erreur lors de la suppression, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (deletedStatus.code) {
                res.json({ status: 500, msg: "Erreur lors de la suppression du statut de commande" })
            } 
            // Si la suppression est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Statut de commande supprimé" })
            }
        } 
        // Gestion des erreurs lors de la suppression
        catch (err) {
            res.json({ status: 500, msg: "Échec de la suppression du statut de commande" })
        }
    }

    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveOrderStatus,
        getOneOrderStatus,
        getAllOrderStatuses,
        getOneOrderStatusWithOrders,
        updateOrderStatus,
        deleteOrderStatus
    }
}
