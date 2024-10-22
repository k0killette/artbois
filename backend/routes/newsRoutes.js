/* 
Ce fichier gère les routes pour la gestion des actualités, des statuts associés aux actualités et des images associées aux actualités.
*/

// Importation du middleware withAuthAdmin qui protège certaines routes en autorisant uniquement les administrateurs authentifiés à y accéder
const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    // Importation des modèles pour la gestion des statuts d'actualité, des actualités et des images des actualités
    const NewsStatusModel = require('../models/NewsStatusModel')(db)
    const NewsModel = require('../models/NewsModel')(db)
    const NewsImageModel = require('../models/NewsImageModel')(db)

    // Importation des contrôleurs pour la gestion des statuts d'actualité, des actualités et des images des actualités
    const newsStatusController = require('../controllers/newsStatusController')(NewsStatusModel)
    const newsController = require('../controllers/newsController')(NewsModel)
    const newsImageController = require('../controllers/newsImageController')(NewsImageModel)

    { /* NEWS STATUS ROUTES */ }

    // (vérifiée)
    // Route de sauvegarde d'un nouveau statut d'actualité avec accès limité aux administrateurs authentifiés
    app.post('/api/artbois/news-statuses', withAuthAdmin, newsStatusController.saveNewsStatus)

    // (vérifiée)
    // Route de récupération de tous les statuts d'actualité
    app.get('/api/artbois/news-statuses', newsStatusController.getAllNewsStatuses)

    // (vérifiée)
    // Route de récupération d'un statut avec ses actualités associées
    app.get('/api/artbois/news-statuses/:newsStatusId/news', newsStatusController.getOneNewsStatusWithNews)

    // (vérifiée)
    // Route de récupération d'un statut d'actualité par son id
    app.get('/api/artbois/news-statuses/:id', newsStatusController.getOneNewsStatus)

    // (vérifiée)
    // Route de mise à jour d'un statut d'actualité avec accès limité aux administrateurs authentifiés
    app.put('/api/artbois/news-statuses/:id', withAuthAdmin, newsStatusController.updateNewsStatus)

    // (vérifiée)
    // Route de suppression d'un statut d'actualité avec accès limité aux administrateurs authentifiés
    app.delete('/api/artbois/news-statuses/:id', withAuthAdmin, newsStatusController.deleteNewsStatus)

    { /* NEWS ROUTES */ }

    // (vérifiée)
    // Route d'enregistrement d'une actualité avec accès limité aux administrateurs authentifiés
    app.post('/api/artbois/news', withAuthAdmin, newsController.saveOneNews)

    // (vérifiée)
    // Route de récupération de toutes les actualités
    app.get('/api/artbois/news', newsController.getAllNews)

    // (vérifiée)
    // Route de récupération d'une actualité par son titre
    app.get('/api/artbois/news/title', newsController.getOneNewsByTitle)

    // (vérifiée)
    // Route de récupération d'une actualité par son id
    app.get('/api/artbois/news/:id', newsController.getOneNews)

    // (vérifiée)
    // Route de modification d'une actualité avec accès limité aux administrateurs authentifiés
    app.put('/api/artbois/news/:id', withAuthAdmin, newsController.updateOneNews)

    // (vérifiée)
    // Route de suppression d'une actualité avec accès limité aux administrateurs authentifiés
    app.delete('/api/artbois/news/:id', withAuthAdmin, newsController.deleteOneNews)

    { /* NEWS IMAGE ROUTES */ }

    // (vérifiée)
    // Route d'enregistrement d'une image avec accès limité aux administrateurs authentifiés
    app.post('/api/artbois/news-images', withAuthAdmin, newsImageController.saveOneNewsImage)

    // (vérifiée)
    // Route de récupération de toutes les images
    app.get('/api/artbois/news-images', newsImageController.getAllNewsImages)

    // (vérifiée)
    // Route de récupération d'une image
    app.get('/api/artbois/news-images/:id', newsImageController.getOneNewsImage)

    // (vérifiée)
    //Route de récupération des images liées à une actualité
    app.get('/api/artbois/news/:newsId/images', newsImageController.getImagesByNewsId)

    // (vérifiée)
    // Route de modification d'une image avec accès limité aux administrateurs authentifiés
    app.put('/api/artbois/news-images/:id', withAuthAdmin, newsImageController.updateOneNewsImage)

    // (vérifiée)
    // Route de suppression d'une image avec accès limité aux administrateurs authentifiés
    app.delete('/api/artbois/news-images/:id', withAuthAdmin, newsImageController.deleteOneNewsImage)

}
