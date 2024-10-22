/*
Modèle pour gérer les produits dans la base de données.
*/

// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return ProductModel
}

class ProductModel {

    // Sauvegarde d'un nouveau produit avec le nom, la description, la catégorie, le nombre d'exemplaires en stock, le prix, les dimensions, le poids et la date de création
    static saveOneProduct(req) {
        return db.query('INSERT INTO products (name, description, category_id, stock, price, length, width, height, weight, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [req.body.name, req.body.description, req.body.category_id, req.body.stock, req.body.price, req.body.length, req.body.width, req.body.height, req.body.weight])
            .then((res) => {
                return res // Retourne le résultat de l'insertion
            })
            .catch((err) => {
                return err // Gère les erreurs lors de l'insertion
            })
    }

    // Récupération d'un produit correspondant à un id spécifique, avec sa catégorie et ses images associées via des jointures LEFT JOIN
    static getOneProduct(id) {
        return db.query(`SELECT products.*, 
                                product_categories.name AS category_name, 
                                GROUP_CONCAT(product_images.image_url) AS images_url, 
                                GROUP_CONCAT(product_images.alt) AS images_alt
                        FROM products
                        LEFT JOIN product_categories ON products.category_id = product_categories.id
                        LEFT JOIN product_images ON products.id = product_images.product_id
                        WHERE products.id = ?`, [id])
            .then((res) => {
                return res // Retourne le produit avec les informations jointes
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Récupération de tous les produits avec leurs images associées via une jointure LEFT JOIN et avec un regroupemznt par produit (sinon si un produit a plusieurs images il est retourné autant de fois qu'il a d'images)
    static getAllProducts() {
        return db.query(`SELECT products.* ,
                                GROUP_CONCAT(product_images.image_url) AS images_url, 
                                GROUP_CONCAT(product_images.alt) AS images_alt
                        FROM products
                        LEFT JOIN product_images ON products.id = product_images.product_id
                        GROUP BY products.id`)
            .then((res) => {
                return res // Retourne tous les produits avec leurs images associées
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la récupération
            })
    }

    // Mise à jour d'un produit correspondant à un id spécifique en modifiant le nom, la description, la catégorie, le nombre d'exemplaires en stock, le prix, les dimensions ou le poids
    static updateOneProduct(req, id) {
        return db.query('UPDATE products SET name = ?, description = ?, category_id = ?, stock = ?, price = ?, length = ?, width = ?, height = ?, weight = ? WHERE id = ?', [req.body.name, req.body.description, req.body.category_id, req.body.stock, req.body.price, req.body.length, req.body.width, req.body.height, req.body.weight, id])
            .then((res) => {
                return res // Retourne le résultat de la mise à jour
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la mise à jour
            })
    }

    // Mise à jour du stock d'un produit correspondant à un id spécifique
    static updateOneProductStock(productId, newStock) {
        return db.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, productId])
            .then((res) => {
                return res // Retourne le résultat de la mise à jour
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la mise à jour
            })
    }

    // Suppression d'un produit correspondant à un id spécifique
    static deleteOneProduct(id) {
        return db.query('DELETE FROM products WHERE id = ?', [id])
            .then((res) => {
                return res // Retourne le résultat de la suppression
            })
            .catch((err) => {
                return err // Gère les erreurs lors de la suppression
            })
    }
}
