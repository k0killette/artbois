const withAuthAdmin = require("../middleware/withAuthAdmin")

module.exports = (app, db) => {
    const CategoryModel = require("../models/CategoryModel")(db)
    const categoryController = require("../controllers/categoryController")(CategoryModel)

    // Route d'enregistrement d'une catégorie
    app.post("/api/artbois/categories/save", withAuthAdmin, categoryController.saveCategory)
    
    // Route de récupération d'une catégorie
    app.get("/api/artbois/categories/:id", withAuthAdmin, categoryController.getOneCategory)
    
    // Route de récupération d'une catégorie avec ses produits associés
    app.get("/api/artbois/categories/:id/products", withAuthAdmin, categoryController.getOneCategoryWithProducts)
    
    // Route de récupération des catégories
    app.get("/api/artbois/categories", withAuthAdmin, categoryController.getAllCategories)

    // Route de modification d'une catégorie
    app.put("/api/artbois/categories/update/:id", withAuthAdmin, categoryController.updateOneCategory)

    // Route de suppression d'une catégorie
    app.delete("/api/artbois/categories/delete/:id", withAuthAdmin, categoryController.deleteOneCategory)
}