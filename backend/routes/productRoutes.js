const withAuth = require('../middleware/withAuth')
const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    const ProductModel = require("../models/ProductModel")(db)
    const productController = require("../controllers/productController")(ProductModel)
    
    // Route permettant d'enregistrer un produit
    app.post('/api/artbois/products/save', withAuthAdmin, productController.saveProduct)
    
    // Route permettant de récupérer un produit
    app.get('/api/artbois/products/:id', productController.getOneProduct)
    
    // Route permettant de récupérer tous les produits
    app.get('/api/artbois/products', productController.getAllProducts)
    
    // Route permettant de modifier un produit
    app.put('/api/artbois/products/update/:id', withAuthAdmin, productController.updateProduct)
    
    // Route permettant de supprimer un produit
    app.delete('/api/artbois/products/delete/:id', withAuthAdmin, productController.deleteProduct)
}