/*
newsStatusController.js : ce contrôleur gère les opérations liées aux statuts des actualités, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

module.exports = (NewsStatusModel) => {

    // Enregistre un nouveau statut d'actualité
    const saveNewsStatus = async(req, res) => {
        try {
            // Appel au modèle pour enregistrer le statut d'actualité
            const status = await NewsStatusModel.saveOneNewsStatus(req)
            // Si une erreur survient lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (status.code) {
                res.json({ status: 500, msg: "Erreur lors de l'enregistrement du statut d'actualité" })
            }
            // Si l'enregistrement est réussi, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Statut d'actualité enregistré" })
            }
        }
        // Gestion des erreurs globales lors de l'enregistrement
        catch (err) {
            res.json({ status: 500, msg: "Échec de l'enregistrement du statut d'actualité" })
        }
    }

    // Récupère un statut d'actualité
    const getOneNewsStatus = async(req, res) => {
        try {
            // Appel au modèle pour récupérer le statut d'actualité par son id
            const status = await NewsStatusModel.getOneNewsStatus(req.params.id)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (status.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération du statut d'actualité" })
            }
            // Sinon renvoie la réponse avec le statut d'actualité trouvé avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: status[0] })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Échec de la récupération du statut d'actualité" })
        }
    }

    // Récupère tous les statuts d'actualité
    const getAllNewsStatuses = async(req, res) => {
        try {
            // Appel au modèle pour récupérer tous les statuts d'actualité
            const statuses = await NewsStatusModel.getAllNewsStatuses()
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (statuses.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération des statuts d'actualité" })
            }
            // Sinon renvoie la réponse avec tous les statuts d'actualité avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: statuses })
            }    
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Échec de la récupération des statuts d'actualité" })
        }
    }

    // Récupère un statut d'actualité avec ses actualités associées
    const getOneNewsStatusWithNews = async(req, res) => {
        try {
            // Appel au modèle pour récupérer un statut avec ses actualités associées
            const newsStatusWithNews = await NewsStatusModel.getOneNewsStatusWithNews(req.params.newsStatusId)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (newsStatusWithNews.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération du statut avec ses actualités" })
            } 
            // Crée un objet pour stocker le statut et les actualités associées
            else {
                // Initialise l'objet status pour contenir le statut et les actualités associées
                let status = {}
                // Si le statut existe et a des actualités associées
                if (newsStatusWithNews.length > 0) {
                    // Récupère l'id du statut et son nom, et crée un tableau des actualités associées
                    status = {
                        id: newsStatusWithNews[0].id,
                        status_name: newsStatusWithNews[0].name,
                        news: newsStatusWithNews
                            .map(news => ({
                                id: news.news_id,
                                title: news.news_title
                            })) // Boucle sur les actualités associées au statut pour créer un tableau avec les ids et titres
                            .filter(news => news.id) // Filtre les actualités valides (celles avec un id)
                    }
                }
                // Si le statut n'a pas d'actualité associée ou n'existe pas
                else {
                    // Appel au modèle pour récupérer les détails du statut d'actualité par son id
                    const newsStatusDetails = await NewsStatusModel.getOneNewsStatus(req.params.newsStatusId)
                    // Stocke les informations du statut sans actualité
                    status = {
                        id: newsStatusDetails[0].id,
                        name: newsStatusDetails[0].name,
                        news: [] // Tableau vide, aucune actualité associée
                    }
                }
                // Renvoie la réponse avec le statut et ses actualités (ou vide) avec un statut 200 (OK)
                res.json({ status: 200, result: status })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération du statut avec ses actualités" })
        }
    }

    // Met à jour un statut d'actualité
    const updateNewsStatus = async(req, res) => {
        try {
            // Appel au modèle pour mettre à jour le statut d'actualité
            const updatedStatus = await NewsStatusModel.updateOneNewsStatus(req, req.params.id)
            // Si une erreur survient lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (updatedStatus.code) {
                res.json({ status: 500, msg: "Erreur lors de la mise à jour du statut d'actualité" })
            }
            // Si la mise à jour est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Statut d'actualité mis à jour" })
            }
        }
        // Gestion des erreurs lors de la mise à jour
        catch (err) {
            res.json({ status: 500, msg: "Échec de la mise à jour du statut d'actualité" })
        }
    }

    // Supprime un statut d'actualité
    const deleteNewsStatus = async(req, res) => {
        try {
            // Appel au modèle pour supprimer le statut d'actualité
            const deletedStatus = await NewsStatusModel.deleteOneNewsStatus(req.params.id)
            // En cas d'erreur lors de la suppression, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (deletedStatus.code) {
                res.json({ status: 500, msg: "Erreur lors de la suppression du statut d'actualité" })
            }
            // Si la suppression est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Statut d'actualité supprimé" })
            }
        }
        // Gestion des erreurs lors de la suppression
        catch (err) {
            res.json({ status: 500, msg: "Échec de la suppression du statut d'actualité" })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveNewsStatus,
        getOneNewsStatus,
        getAllNewsStatuses,
        getOneNewsStatusWithNews,
        updateNewsStatus,
        deleteNewsStatus
    }
}
