const fs = require("fs");

module.exports = (NewsModel) => {

    // Sauvegarde d'une nouvelle actualité
    const saveNews = async(req, res) => {
        try {
            const news = await NewsModel.saveOneNews(req)
            if (news.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de l'actualité" })
            }
            else {
                res.json({ status: 200, msg: "Actualité enregistrée" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement de l'actualité" })
        }
    }

    // Récupération d'une actu par son id
    const getOneNews = async(req, res) => {
        try {
            const news = await NewsModel.getOneNews(req.params.id)
            if (news.length === 0) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de l'actualité" })
            }
            else {
                res.json({ status: 200, result: news[0] })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération de l'actualité" })
        }
    }

    // Récupération d'une actu par son titre
    const getOneNewsByTitle = async(req, res) => {
        try {
            const news = await NewsModel.getOneNewsByTitle(req.query.title)
            if (news.length === 0) {
                return res.json({ status: 404, msg: "Aucune actualité correspondante n'a été trouvée" })
            }
            else {
                res.json({ status: 200, result: news })
            }    
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération de l'actualité" })
        }
    }

    // Récupération de toutes les actus
    const getAllNews = async(req, res) => {
        try {
            const news = await NewsModel.getAllNews()
            if (news.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des actualités" })
            }
            else {
                res.json({ status: 200, result: news })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération des actualités" })
        }
    }

    // Mise à jour d'une actualité par son id
    const updateNews = async(req, res) => {
        try {
            const updatedNews = await NewsModel.updateOneNews(req, req.params.id)
            if (updatedNews.code) {
                return res.json({ status: 500, msg: "Erreur lors de la mise à jour de l'actualité" })
            }
            else {
                res.json({ status: 200, msg: "Actualité modifiée" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la mise à jour de l'actualité" })
        }
    }

    // Suppression d'une actu par son id
    const deleteNews = async(req, res) => {
        try {
            const deletedNews = await NewsModel.deleteOneNews(req.params.id)
            if (deletedNews.code) {
                return res.json({ status: 500, msg: "Erreur lors de la suppression de l'actualité" })
            }
            else {
                res.json({ status: 200, msg: "Actualité supprimée" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    return {
        saveNews,
        getOneNews,
        getOneNewsByTitle,
        getAllNews,
        updateNews,
        deleteNews
    }
}
