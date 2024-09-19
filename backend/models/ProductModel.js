module.exports = (_db)=>{
    db = _db
    return ProductModel
}

class ProductModel {
    
    // Sauvegarde d'un nouveau produit
    static saveOneProduct(req){
        return db.query('INSERT INTO products (name, description, categories_id, quantity, price, image_url, alt, length, width, height, weight, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [req.body.name, req.body.description, req.body.categories_id, req.body.quantity, req.body.price, req.body.image_url, req.body.alt, req.body.length, req.body.width, req.body.height, req.body.weight])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    // Récupération d'un produit par son id avec sa catégorie
    static getOneProduct(id){
        return db.query(`SELECT products.*, 
                                categories.name AS category_name 
                        FROM products
                        LEFT JOIN categories ON products.categories_id = categories.id
                        WHERE products.id = ?`, [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    // Récupération de tous les produits
    static getAllProducts() {
        return db.query(`SELECT * FROM products`)
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    // Modification d'un produit par son id
    static updateOneProduct(req, id){
        return db.query('UPDATE products SET name = ?, description = ?, categories_id = ?, quantity = ?, price = ?, image_url = ?, alt = ?, length = ?, width = ?, height = ?, weight = ? WHERE id = ?', [req.body.name, req.body.description, req.body.categories_id, req.body.quantity, req.body.price, req.body.image_url, req.body.alt, req.body.length, req.body.width, req.body.height, req.body.weight, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    // Suppression d'un produit par son id
    static deleteOneProduct(id){
        return db.query('DELETE FROM products WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}
