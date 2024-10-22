/* 
Modèle pour gérer les images associées aux actualités dans la base de données.
*/

// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return NewsImageModel
}

class NewsImageModel {
    
    // Sauvegarde d'une nouvelle image avec l'identifiant de l'actualité associée, son URL et son attribut alt
    static saveOneNewsImage(req) {
        return db.query('INSERT INTO news_images (news_id, image_url, alt) VALUES (?, ?, ?)', [req.news_id, req.image_url, req.alt])
        .then((res) => {
            return res // Retourne le résultat de l'insertion
        })
        .catch((err) => {
            return err // Gère les erreurs lors de l'insertion
        })        
    }
    
    // Récupération d'une image correspondant à un id spécifique
    static getOneNewsImage(id) {
        return db.query('SELECT * FROM news_images WHERE id = ?', [id])
        .then((res) => {
            return res // Retourne les informations de l'image
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })        
    }
    
    // Récupération de toutes les images associées à une actualité via son identifiant (news_id)
    static getImagesByNewsId(newsId) {
        return db.query('SELECT * FROM news_images WHERE news_id = ?', [newsId])
        .then((res) => {
            return res // Retourne les images associées à l'actualité
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })        
    }
    
    // Récupération de toutes les images avec les titres des actualités associées via une jointure LEFT JOIN
    static getAllNewsImages() {
        return db.query(`SELECT news_images.*, 
                                news.title AS news_title 
                        FROM news_images 
                        LEFT JOIN news ON news_images.news_id = news.id`)
        .then((res) => {
            return res // Retourne toutes les images avec les actualités associées
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })        
    }
    
    // Mise à jour d'une image correspondant à un id spécifique en modifiant son news_id et son alt
    static updateOneNewsImage(req, id) {
        return db.query('UPDATE news_images SET news_id = ?, alt = ? WHERE id = ?', [req.news_id, req.alt, id]
        )
        .then((res) => {
            return res // Retourne le résultat de la mise à jour
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la mise à jour
        })      
    }
    
    // Suppression d'une image correspondant à un id spécifique
    static deleteOneNewsImage(id) {
        return db.query('DELETE FROM news_images WHERE id = ?', [id])
        .then((res) => {
            return res // Retourne le résultat de la suppression
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la suppression
        })        
    }
}
