/*
Modèle pour gérer les statuts associés aux actualités dans la base de données.
*/


// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return NewsStatusModel
}

class NewsStatusModel {

    // Sauvegarde d'un nouveau statut d'actualité avec son nom
    static saveOneNewsStatus(req) {
        return db.query('INSERT INTO news_statuses (status_name) VALUES (?)', [req.body.status_name])
        .then((res) => {
            return res // Retourne le résultat de l'insertion
        })
        .catch((err) => {
            return err // Gère les erreurs lors de l'insertion
        })
    }

    // Récupération d'un statut d'actualité correspondant à un id spécifique
    static getOneNewsStatus(id) {
        return db.query('SELECT * FROM news_statuses WHERE id = ?', [id])
        .then((res) => {
            return res // Retourne le statut d'actualité
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }
    
    // Récupération d'un statut d'actualité avec les actualités associées via une jointure LEFT JOIN
    static getOneNewsStatusWithNews(newsStatusId) {
        return db.query(`SELECT news_statuses.*, 
                                news.id AS news_id, news.title AS news_title 
                        FROM news_statuses 
                        LEFT JOIN news ON news_statuses.id = news.status_id 
                        WHERE news_statuses.id = ?`, [newsStatusId]) 
        .then((res) => {
            // S'il n'y a aucune actualité dans le statut choisi
            if (res.length === 0) {
            return { message: "Aucune actualité n'a été trouvée", news: [] }
            }
            return res // Retourne le statut d'actualité avec les actualités associées
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }
    
    // Récupération de tous les statuts d'actualité
    static getAllNewsStatuses() {
        return db.query('SELECT * FROM news_statuses')
        .then((res) => {
            return res // Retourne tous les statuts d'actualité
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }
    
    // Mise à jour d'un statut d'actualité correspondant à un id spécifique en modifiant son nom
    static updateOneNewsStatus(req, id) {
        return db.query('UPDATE news_statuses SET status_name = ? WHERE id = ?', [req.body.status_name, id])
        .then((res) => {
            return res // Retourne le résultat de la mise à jour
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la mise à jour
        })
    }

    // Suppression d'un statut d'actualité correspondant à un id spécifique
    static deleteOneNewsStatus(id) {
        return db.query('DELETE FROM news_statuses WHERE id = ?', [id])
        .then((res) => {
            return res // Retourne le résultat de la suppression
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la suppression
        })
    }
}
