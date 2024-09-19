const fs = require("fs")

module.exports = (CategoryModel) => {

    // Fonction de sauvegarde d'une nouvelle catégorie dans la BDD
    const saveCategory = async(req, res) => {
        try {
            // Enregistrement de la catégorie
            const category = await CategoryModel.saveOneCategory(req)
            // On vérifie si un code d'erreur remonte à l'enregistrement de la catégorie
            if (category.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de la catégorie" })
            }
            else {
                res.json({ status: 200, msg: "Nouvelle catégorie enregistrée" })
            }
        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement de la catégorie" })
        }
    }

    // Fonction de récupération d'une catégorie par son id
    const getOneCategory = async(req, res) => {
        try {
            // Récupération d'une catégorie par son id
            const category = await CategoryModel.getOneCategory(req.params.id)

            // On vérifie s'il y a un code d'erreur lors de la récupération
            if (category.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de la catégorie" })
            }
            else {
                // On renvoie les informations de la catégorie
                res.json({ status: 200, category: category[0] })
            }
        }
        // Gestion générale des erreurs
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération de la catégorie" })
        }
    }

    // Fonction de récupération d'une catégorie avec ses produits associés
    const getOneCategoryWithProducts = async(req, res) => {
        try {
            // Récupération d'une catégorie avec ses produits
            const categoryWithProducts = await CategoryModel.getOneCategoryWithProducts(req)

            if (categoryWithProducts.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de la catégorie avec ses produits" })
            }
            else {
                let category = {}
                // Si la catégorie existe et a des produits associés
                if (categoryWithProducts.length > 0) {
                    category = {
                        id: categoryWithProducts[0].id,
                        name: categoryWithProducts[0].name,
                        products: categoryWithProducts.map(product => ({
                            id: product.product_id,
                            name: product.product_name
                        })).filter(product => product.id)
                    }
                }
                // Si la catégorie n'a pas de produits ou n'existe pas
                else {
                    const categoryDetails = await CategoryModel.getOneCategory(req.params.id)
                    category = {
                        id: categoryDetails[0].id,
                        name: categoryDetails[0].name,
                        products: []
                    }
                }
                console.log(category) // faire les tests avec postman pour décider du format
                res.json({ status: 200, category })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération de la catégorie avec ses produits" })
        }
    }

    // Fonction de récupération de toutes les catégories 
    const getAllCategories = async(req, res) => {
        try {
            const categories = await CategoryModel.getAllCategories()
            // On vérifie s'il n'y a pas de code d'erreur lors de la récupération
            if (categories.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des catégories" })
            }
            // Sinon on renvoie les informations des catégories
            else {
                res.json({ status: 200, categories })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération des catégories" })
        }
    }

    // Fonction de modification d'une catégorie  
    const updateOneCategory = async(req, res) => {
        try {
            const updatedCategory = await CategoryModel.updateOneCategory(req, req.params.id)

            if (updatedCategory.code) {
                return res.json({ status: 500, msg: "Erreur lors de la modification de la catégorie" })
            }
            else {
                res.json({ status: 200, msg: "Catégorie mise à jour" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la modification de la catégorie" })
        }
    }

    // Fonction de suppression d'une catégorie  
    const deleteOneCategory = async(req, res) => {
        try {
            const deletedCategory = await CategoryModel.deleteOneCategory(req.params.id)
            // On vérifie s'il y a un code d'erreur 
            if (deletedCategory.code) {
                return res.json({ status: 500, msg: "Erreur lors de la suppression de la catégorie" })
            }
            else {
                res.json({ status: 200, msg: "Catégorie supprimée" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la suppression de la catégorie" })
        }
    }

    return {
        saveCategory,
        getOneCategory,
        getOneCategoryWithProducts,
        getAllCategories,
        updateOneCategory,
        deleteOneCategory
    }
}
