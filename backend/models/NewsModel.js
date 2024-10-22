/*
Modèle pour gérer les actualités dans la base de données.
*/

// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return NewsModel
}

class NewsModel {

    // Sauvegarde d`une nouvelle actualité avec un titre, du contenu, un statut et la date de création
    static saveOneNews(req) {
        if (!req.body.title || !req.body.content || !req.body.status_id) {
            return Promise.reject("Les champs titre, contenu, et statut sont requis")
        }
        return db.query(`INSERT INTO news (title, content, status_id, created_at) VALUES (?, ?, ?, NOW())`, [req.body.title, req.body.content, req.body.status_id])
            .then((res) => {
                return res // Retourne le résultat de l'insertion
            })
            .catch((err) => {
                return err // Gère les erreurs lors de l'insertion
            })
    }

    // Récupération d'une actualité correspondant à un id spécifique, avec son statut et ses images associées via des jointures LEFT JOIN
    static getOneNews(id) {
        return db.query(`SELECT news.*,
                                news_statuses.status_name AS news_status,
                                GROUP_CONCAT(news_images.image_url) AS images_url, 
                                GROUP_CONCAT(news_images.alt) AS images_alt
                        FROM news 
                        LEFT JOIN news_statuses ON news.status_id = news_statuses.id
                        LEFT JOIN news_images ON news.id = news_images.news_id
                        WHERE news.id = ?`, [id])
            .then((res) => {
                return res // Retourne l'actualité avec les informations jointes
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Récupération d`une actualité par son titre avec l'opérateur LIKE et le caractère % ("wildcard", représente zéro, un ou plusieurs caractères) pour effectuer une recherche partielle sur la colonne title
    // Exemple : si le searchTerm est "Actu", la requête SQL cherchera tous les titres qui contiennent "Actu", comme "Nouvelle Actu", "Actualité", etc.
    static getOneNewsByTitle(searchTerm) {
        if (!searchTerm || searchTerm.length < 3) {
            return Promise.reject("Le terme de recherche doit contenir au moins 3 caractères")
        }
        return db.query(`SELECT * FROM news WHERE title LIKE ?`, [`%${searchTerm}%`]) // `%` permet de rechercher des correspondances partielles 
            .then((res) => {
                return res // Retourne les actualités correspondantes
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la recherche
            })
    }

    // Récupération de toutes les actualités avec leurs images associées via une jointure LEFT JOIN et avec un regroupemznt par actualité (sinon si une actualité a plusieurs images elle est retournée autant de fois qu'elle a d'images)
    static getAllNews() {
        return db.query(`SELECT news.* ,
                                GROUP_CONCAT(news_images.image_url) AS images_url, 
                                GROUP_CONCAT(news_images.alt) AS images_alt
                        FROM news
                        LEFT JOIN news_images ON news.id = news_images.news_id
                        GROUP BY news.id`)
            .then((res) => {
                return res // Retourne toutes les actualités avec leurs images associées
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Mise à jour d`une actualité correspondant à un id spécifique en modifiant son titre, son contenu et son statut
    static updateOneNews(req, id) {
        if (!req.body.title || !req.body.content || !req.body.status_id) {
            return Promise.reject("Les champs titre, contenu, et statut sont requis")
        }
        return db.query(`UPDATE news SET title = ?, content = ?, status_id = ? WHERE id = ?`, [req.body.title, req.body.content, req.body.status_id, id])
            .then((res) => {
                return res // Retourne le résultat de la mise à jour
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la mise à jour
            })
    }

    // Suppression d`une actualité correspondant à un id spécifique
    static deleteOneNews(id) {
        return db.query(`DELETE FROM news WHERE id = ?`, [id])
            .then((res) => {
                return res // Retourne le résultat de la suppression
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la suppression
            })
    }
}
