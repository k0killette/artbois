module.exports = (_db) => {
    db = _db
    return ImageModel
}

class ImageModel {
    
    // Sauvegarde d'une nouvelle image dans la BDD
    static saveOneImage(req) {
        return db.query('INSERT INTO images (images_url, alt, products_id, news_id) VALUES (?, ?, ?, ?)', [req.body.images_url, req.body.alt, req.body.products_id, req.body.news_id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })        
    }
    
    // Récupération d'une image par son id
    static getOneImage(id) {
        return db.query('SELECT * FROM images WHERE id = ?', [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })        
    }
    
    // Récupération de toutes les images avec les produits ou actus associées
    static getAllImages() {
        return db.query(`SELECT images.*, 
                                products.name AS product_name, 
                                news.title AS news_title 
                        FROM images 
                        LEFT JOIN products ON images.products_id = products.id 
                        LEFT JOIN news ON images.news_id = news.id`)
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })        
    }
    
    // Mise à jour d'une image par son id
    static updateOneImage(req, id) {
        return db.query('UPDATE images SET images_url = ?, alt = ?, products_id = ?, news_id = ? WHERE id = ?', [req.body.images_url, req.body.alt, req.body.products_id, req.body.news_id, id]
        )
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })      
    }
    
    // Suppression d'une image par son id
    static deleteOneImage(id) {
        return db.query('DELETE FROM images WHERE id = ?', [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })        
    }
}