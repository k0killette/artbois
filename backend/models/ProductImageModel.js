/* 
Modèle pour gérer les images associées aux produits dans la base de données.
*/

// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return ProductImageModel
}

class ProductImageModel {

    // Sauvegarde d'une nouvelle image avec l'identifiant du produit associé, son URL et son attribut alt
    static saveOneProductImage(req) {
        return db.query('INSERT INTO product_images (product_id, image_url, alt) VALUES (?, ?, ?)', [req.product_id, req.image_url, req.alt])
            .then((res) => {
                return res // Retourne le résultat de l'insertion
            })
            .catch((err) => {
                return err // Gère les erreurs lors de l'insertion
            })
    }

    // Récupération de l'image correspondant à un id spécifique
    static getOneProductImage(id) {
        return db.query('SELECT * FROM product_images WHERE id = ?', [id])
            .then((res) => {
                return res // Retourne les informations de l'image
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Récupération de toutes les images associées à un produit via son identifiant (product_id)
    static getImagesByProductId(productId) {
        return db.query('SELECT * FROM product_images WHERE product_id = ?', [productId])
            .then((res) => {
                return res // Retourne les images associées au produit
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Récupération de toutes les images avec les noms des produits associés via une jointure LEFT JOIN
    static getAllProductsImages() {
        return db.query(`SELECT product_images.*, 
                                products.name AS product_name 
                        FROM product_images 
                        LEFT JOIN products ON product_images.product_id = products.id`)
            .then((res) => {
                return res // Retourne toutes les images avec les produits associés
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Mise à jour d'une image correspondant à un id spécifique en modifiant son product_id et son alt
    static updateOneProductImage(req, id) {
        return db.query('UPDATE product_images SET product_id = ?, alt = ? WHERE id = ?', [req.product_id, req.alt, id])
            .then((res) => {
                return res // Retourne le résultat de la mise à jour
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la mise à jour
            })
    }

    // Suppression de l'image correspondant à un id spécifique
    static deleteOneProductImage(id) {
        return db.query('DELETE FROM product_images WHERE id = ?', [id])
            .then((res) => {
                return res // Retourne le résultat de la suppression
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la suppression
            })
    }
}
