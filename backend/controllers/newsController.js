/*
newsController.js : ce contrôleur gère les opérations liées aux actualités, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

module.exports = (NewsModel) => {

    // Enregistre une nouvelle actualité dans la base de données
    const saveOneNews = async(req, res) => {
        try {
            // Appel au modèle pour enregistrer l'actualité 
            const news = await NewsModel.saveOneNews(req)
            // En cas d'erreur lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (news.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de l'actualité" })
            }
            // Si l'enregistrement est réussi, renvoie une réponse avec un statut 200 (OK) et les données de l'actualité
            else {
                res.json({ status: 200, msg: "Actualité enregistrée" })
            }
        }
        // Gestion des erreurs globales lors de l'enregistrement
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement de l'actualité" })
        }
    }

    // Récupère une actualité par son id
    const getOneNews = async(req, res) => {
        try {
            // Appel au modèle pour récupérer l'actualité par son id
            const result = await NewsModel.getOneNews(req.params.id)
            // Si aucune actualité n'est trouvée, renvoie une réponse avec un statut 404 (Not Found)
            if (result.length === 0) {
                return res.json({ status: 404, msg: "Actualité non trouvée" })
            }
            // Sinon transforme les chaînes concaténées (images_url et images_alt) en tableaux
            else {
                // Prend le premier élément (car il ne devrait y avoir qu'une seule actualité correspondant à l'id)
                const news = result[0]
                // Si des images sont présentes, transforme la chaîne concaténée en tableau, sinon renvoie un tableau vide
                news.images_url = news.images_url ? news.images_url.split(',') : []
                // Si des alt sont présents, transforme la chaîne concaténée en tableau, sinon renvoie un tableau vide
                news.images_alt = news.images_alt ? news.images_alt.split(',') : []
                // Renvoie la réponse avec l'actualité et ses images avec un statut 200 (OK)
                res.json({ status: 200, result: news })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération de l'actualité" })
        }
    }

    // Récupère une actualité par son titre
    const getOneNewsByTitle = async(req, res) => {
        try {
            // Appel au modèle pour rechercher l'actualité par son titre
            const news = await NewsModel.getOneNewsByTitle(req.query.title)
            // Si aucune actualité n'est trouvée, renvoie une réponse avec un statut 404
            if (news.length === 0) {
                return res.json({ status: 404, msg: "Aucune actualité correspondante n'a été trouvée" })
            }
            // Sinon renvoie la réponse avec les actualités trouvées avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: news })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération de l'actualité" })
        }
    }

    // Récupère toutes les actualités
    const getAllNews = async(req, res) => {
        try {
            // Appel au modèle pour récupérer toutes les actualités
            const results = await NewsModel.getAllNews()
            // Si aucune actualité n'est trouvée, renvoie une réponse avec un statut 404 (Not Found)
            if (results.length === 0) {
                return res.json({ status: 404, msg: "Aucune actualité n'a été trouvée" })
            }
            // Sinon transforme les chaînes concaténées (images_url et images_alt) en tableaux pour chaque actualité
            else {
                // Boucle sur chaque actualité
                const news = results.map(article => ({
                    ...article, 
                    images_url: article.images_url ? article.images_url.split(',') : [],
                    images_alt: article.images_alt ? article.images_alt.split(',') : []
                }))
                    // ... est un opérateur de décomposition (spread operator), il permet de "décomposer" un objet ou un tableau et de récupérer toutes ses propriétés ou éléments. 
                    // Avec ...article on crée une copie de l'objet article, en incluant toutes ses propriétés sans les modifier, et ensuite on peut ajouter ou modifier des propriétés spécifiques, comme images_url et images_alt
                    // On pourrait aussi créer directement l'objet article avec toutes ses propriétés, et modifier celles que l'on souhaite :
                    /* return {
                        id: article.id,
                        title: article.title,
                        content: article.content,
                        status_id: article.status_id,
                        created_at: article.created_at,
                        images_url: article.images_url ? article.images_url.split(',') : [],
                        images_alt: article.images_alt ? article.images_alt.split(',') : []
                    } */
                // Renvoie la réponse avec toutes les actualités et leurs images avec un statut 200 (OK)
                res.json({ status: 200, result: news })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération des actualités" })
        }
    }

    // Met à jour une actualité par son id 
    const updateOneNews = async(req, res) => {
        try {
            // Appel au modèle pour mettre à jour l'actualité
            const updatedNews = await NewsModel.updateOneNews(req, req.params.id)
            // Si une erreur survient lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (updatedNews.code) {
                return res.json({ status: 500, msg: "Erreur lors de la mise à jour de l'actualité" })
            }
            // Si la mise à jour est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Actualité modifiée" })
            }
        }
        // Gestion des erreurs lors de la mise à jour
        catch (err) {
            res.json({ status: 500, msg: "Echec de la mise à jour de l'actualité" })
        }
    }

    // Supprime une actualité par son id
    const deleteOneNews = async(req, res) => {
        try {
            // Appel au modèle pour supprimer l'actualité
            const deletedNews = await NewsModel.deleteOneNews(req.params.id)
            // En cas d'erreur lors de la suppression, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (deletedNews.code) {
                return res.json({ status: 500, msg: "Erreur lors de la suppression de l'actualité" })
            }
            // Si la suppression est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Actualité supprimée" })
            }
        }
        // Gestion des erreurs lors de la suppression
        catch (err) {
            res.json({ status: 500, msg: "Echec de la suppression de l'actualité" })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveOneNews,
        getOneNews,
        getOneNewsByTitle,
        getAllNews,
        updateOneNews,
        deleteOneNews
    }
}
