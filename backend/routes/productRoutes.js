/* 
Ce fichier gère les routes pour la gestion des produits, des catégories de produits et des images associées aux produits.
*/

// Importation du middleware withAuth qui protège certaines routes en autorisant uniquement les utilisateurs authentifiés à y accéder
const withAuth = require('../middleware/withAuth')
// Importation du middleware withAuthAdmin qui protège certaines routes en autorisant uniquement les administrateurs authentifiés à y accéder
const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    // Importation des modèles pour la gestion des catégories de produit, des produits et des images de produit
    const ProductCategoryModel = require('../models/ProductCategoryModel')(db)
    const ProductModel = require('../models/ProductModel')(db)
    const ProductImageModel = require('../models/ProductImageModel')(db)
    // Importation des contrôleurs pour la gestion des catégories de produit, des produits et des images de produit
    const productCategoryController = require('../controllers/productCategoryController')(ProductCategoryModel)
    const productController = require('../controllers/productController')(ProductModel)
    const productImageController = require('../controllers/productImageController')(ProductImageModel)

    { /* PRODUCT CATEGORY ROUTES */ }

    // (vérifiée)
    // Route d'enregistrement d'une catégorie avec accès limité aux administrateurs authentifiés
    app.post('/api/artbois/product-categories', withAuthAdmin, productCategoryController.saveOneProductCategory)

    // (vérifiée)
    // Route de récupération de toutes les catégories
    app.get('/api/artbois/product-categories', productCategoryController.getAllProductCategories)
 
    // (vérifiée)
    // Route de récupération d'une catégorie avec ses produits associés
    app.get('/api/artbois/product-categories/:categoryId/products', productCategoryController.getOneProductCategoryWithProducts)
 
    // (vérifiée)
    // Route de récupération d'une catégorie par son id
    app.get('/api/artbois/product-categories/:id', productCategoryController.getOneProductCategory)

    // (vérifiée)
    // Route de modification d'une catégorie avec accès limité aux administrateurs authentifiés
    app.put('/api/artbois/product-categories/:id', withAuthAdmin, productCategoryController.updateOneProductCategory)

    // (vérifiée)
    // Route de suppression d'une catégorie avec accès limité aux administrateurs authentifiés
    app.delete('/api/artbois/product-categories/:id', withAuthAdmin, productCategoryController.deleteOneProductCategory)

    { /* PRODUCT ROUTES */ }

    // (vérifiée)
    // Route permettant d'enregistrer un produit avec accès limité aux administrateurs authentifiés
    app.post('/api/artbois/products', withAuthAdmin, productController.saveProduct)

    // (vérifiée)
    // Route permettant de récupérer tous les produits
    app.get('/api/artbois/products', productController.getAllProducts)
    
    // (vérifiée)
    // Route permettant de récupérer un produit par son id
    app.get('/api/artbois/products/:id', productController.getOneProduct)

    // (vérifiée)
    // Route permettant de modifier un produit avec accès limité aux administrateurs authentifiés
    app.put('/api/artbois/products/:id', withAuthAdmin, productController.updateProduct)

    // (vérifiée)
    // Route permettant de supprimer un produit avec accès limité aux administrateurs authentifiés
    app.delete('/api/artbois/products/:id', withAuthAdmin, productController.deleteProduct)

    { /* PRODUCT IMAGE ROUTES */ }

    // (vérifiée)
    // Route d'enregistrement d'une image avec accès limité aux administrateurs authentifiés
    app.post('/api/artbois/product-images', withAuthAdmin, productImageController.saveOneProductImage)

    // (vérifiée)
    // Route de récupération de toutes les images
    app.get('/api/artbois/product-images', productImageController.getAllProductsImages)

    // (vérifiée)
    //Route de récupération des images liées à un produit
    app.get('/api/artbois/products/:productId/images', productImageController.getImagesByProductId)

    // (vérifiée)
    // Route de récupération d'une image
    app.get('/api/artbois/product-images/:id', productImageController.getOneProductImage)

    // (vérifiée)
    // Route de modification d'une image avec accès limité aux administrateurs authentifiés
    app.put('/api/artbois/product-images/:id', withAuthAdmin, productImageController.updateOneProductImage)

    // (vérifiée)
    // Route de suppression d'une image avec accès limité aux administrateurs authentifiés
    app.delete('/api/artbois/product-images/:id', withAuthAdmin, productImageController.deleteOneProductImage)


}
