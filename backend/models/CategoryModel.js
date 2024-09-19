module.exports = (_db) => {
    db = _db
    return CategoryModel
}

class CategoryModel {
    
    // Application de la méthode CRUD : Create - Read - Update - Delete
    
    // Sauvegarde d'une nouvelle catégorie de produit
    static saveOneCategory(req) {
        return db.query('INSERT INTO categories (name) VALUES (?)', [req.body.name])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })        
    }
    
    // Récupération d'une catégorie par son id
    static getOneCategory(id) {
        return db.query('SELECT * FROM categories WHERE id = ?', [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    // Récupération d'une catégorie avec ses produits
    static getOneCategoryWithProducts(req) {
        return db.query(`SELECT categories.*, 
                                products.id AS product_id, products.name AS product_name 
                        FROM categories 
                        LEFT JOIN products ON categories.id = products.categories_id 
                        WHERE categories.id = ?`, [req.params.id]) //SELECT * FROM `products` WHERE categories_id = 3
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }

    // Récupération de toutes les catégories
    static getAllCategories() {
        return db.query('SELECT * FROM categories')
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }    
    
    // Modification d'une catégorie par son id
    static updateOneCategory(req, id) {
        return db.query('UPDATE categories SET name = ? WHERE id = ?', [req.body.name, id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })          
    }
    
    // Suppression d'une catégorie par son id
    static deleteOneCategory(id) {
        return db.query('DELETE FROM categories WHERE id = ?', [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })  
    }
}
