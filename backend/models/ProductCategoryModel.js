/*
Modèle pour gérer les catégories associées aux produits dans la base de données.
*/


// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return ProductCategoryModel
}

class ProductCategoryModel {
    
    // Application de la méthode CRUD : Create - Read - Update - Delete
    
    // Sauvegarde d'une nouvelle catégorie de produit avec son nom
    static saveOneProductCategory(req) {
        return db.query('INSERT INTO product_categories (name) VALUES (?)', [req.body.name])
        .then((res) => {
            return res // Retourne le résultat de l'insertion
        })
        .catch((err) => {
            return err // Gère les erreurs lors de l'insertion
        })        
    }
    
    // Récupération d'une catégorie de produit correspondant à un id spécifique
    static getOneProductCategory(id) {
        return db.query('SELECT * FROM product_categories WHERE id = ?', [id])
        .then((res) => {
            return res // Retourne la catégorie de produit
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }
    
    // Récupération d'une catégorie de produit avec les produits associés via une jointure LEFT JOIN
    static getOneProductCategoryWithProducts(categoryId) {
        console.log(categoryId)
        return db.query(`SELECT product_categories.*, 
                                products.id AS product_id, products.name AS product_name 
                        FROM product_categories 
                        LEFT JOIN products ON product_categories.id = products.category_id 
                        WHERE product_categories.id = ?`, [categoryId]) 
        .then((res) => {
            // S'il n'y a aucun produit dans la catégorie choisie
            if (res.length === 0) {
            return { message: "Aucun produit n'a été trouvé", products: [] }
            }
            return res // Retourne la catégorie de produit avec les produits associés
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }

    // Récupération de toutes les catégories de produit
    static getAllProductCategories() {
        return db.query('SELECT * FROM product_categories')
        .then((res) => {
            return res // Retourne toutes les catégories de produit
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }    
    
    // Mise à jour d'une catégorie de produit correspondant à un id spécifique en modifiant son nom
    static updateOneProductCategory(req, id) {
        return db.query('UPDATE product_categories SET name = ? WHERE id = ?', [req.body.name, id])
        .then((res) => {
            return res // Retourne le résultat de la mise à jour
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la mise à jour
        })          
    }
    
    // Suppression d'une catégorie de produit correspondant à un id spécifique
    static deleteOneProductCategory(id) {
        return db.query('DELETE FROM product_categories WHERE id = ?', [id])
        .then((res) => {
            return res // Retourne le résultat de la suppression
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la suppression
        })  
    }
}
