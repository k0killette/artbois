/*
productCategoryController.js : ce contrôleur gère les opérations liées aux catégories de produits, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

module.exports = (ProductCategoryModel) => {

    // Enregistre une nouvelle catégorie de produit 
    const saveOneProductCategory = async(req, res) => {
        try {
            // Appel au modèle pour enregistrer la catégorie de produit
            const category = await ProductCategoryModel.saveOneProductCategory(req)
            // Si une erreur survient lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (category.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de la catégorie" })
            }
            // Si l'enregistrement est réussi, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Nouvelle catégorie enregistrée" })
            }
        }
        // Gestion des erreurs globales lors de l'enregistrement
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement de la catégorie" })
        }
    }

    // Récupère une catégorie de produit
    const getOneProductCategory = async(req, res) => {
        try {
            // Appel au modèle pour récupérer une catégorie de produit par son id
            const category = await ProductCategoryModel.getOneProductCategory(req.params.id)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (category.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de la catégorie" })
            }
            // Sinon renvoie la réponse avec la catégorie de produit trouvée avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: category[0] })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération de la catégorie" })
        }
    }
    
    // Récupère toutes les catégories de produit
    const getAllProductCategories = async(req, res) => {
        try {
            // Appel au modèle pour récupérer toutes les catégories de produit
            const categories = await ProductCategoryModel.getAllProductCategories()
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (categories.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des catégories" })
            }
            // Sinon renvoie la réponse avec toutes les catégories de produit avec un statut 200 (OK)
            else {
                res.json({ status: 200, result: categories })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération des catégories" })
        }
    }

    // Récupère une catégorie de produit avec ses produits associés
    const getOneProductCategoryWithProducts = async(req, res) => {
        try {
            // Appel au modèle pour récupérer une catégorie avec ses produits
            const categoryWithProducts = await ProductCategoryModel.getOneProductCategoryWithProducts(req.params.categoryId)
            // Si une erreur survient lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (categoryWithProducts.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de la catégorie avec ses produits" })
            }
            // Crée un objet pour stocker la catégorie et les produits associés
            else {
                // Initialise l'objet category pour contenir la catégorie et les produits associés
                let category = {}
                // Si la catégorie existe et a des produits associés
                if (categoryWithProducts.length > 0) {
                    // Récupère l'id de la catégorie et son nom, et crée un tableau des produits associés
                    category = {
                        id: categoryWithProducts[0].id,
                        name: categoryWithProducts[0].name,
                        products: categoryWithProducts
                            .map(product => ({
                                id: product.product_id,
                                name: product.product_name
                            })) // Boucle sur les produits associés à la catégorie pour créer un tableau avec les ids et noms
                            .filter(product => product.id) // Filtre les produits valides (ceux avec un id)
                    }
                }
                // Si la catégorie n'a pas de produit associé ou n'existe pas
                else {
                    // Appel au modèle pour récupérer les détails de la catégorie de produit par son id
                    const categoryDetails = await ProductCategoryModel.getOneProductCategory(req.params.categoryId)
                    // Stocke les informations de la catégorie sans produit
                    category = {
                        id: categoryDetails[0].id,
                        name: categoryDetails[0].name,
                        products: [] // Tableau vide, aucun produit associé
                    }
                }
                // Renvoie la réponse avec la catégorie et ses produits (ou vide) avec un statut 200 (OK)
                res.json({ status: 200, result: category })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération de la catégorie avec ses produits" })
        }
    }

    // Met à jour une catégorie de produit 
    const updateOneProductCategory = async(req, res) => {
        try {
            // Appel au modèle pour mettre à jour la catégorie de produit par son id
            const updatedCategory = await ProductCategoryModel.updateOneProductCategory(req, req.params.id)
            // Si une erreur survient lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (updatedCategory.code) {
                return res.json({ status: 500, msg: "Erreur lors de la modification de la catégorie" })
            }
            // Si la mise à jour est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Catégorie mise à jour" })
            }
        }
        // Gestion des erreurs lors de la mise à jour
        catch (err) {
            res.json({ status: 500, msg: "Echec de la modification de la catégorie" })
        }
    }

    // Supprime une catégorie de produit 
    const deleteOneProductCategory = async(req, res) => {
        try {
            // Appel au modèle pour supprimer la catégorie de produit
            const deletedCategory = await ProductCategoryModel.deleteOneProductCategory(req.params.id)
            // En cas d'erreur lors de la suppression, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (deletedCategory.code) {
                return res.json({ status: 500, msg: "Erreur lors de la suppression de la catégorie" })
            }
            // Si la suppression est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Catégorie supprimée" })
            }
        }
        // Gestion des erreurs lors de la suppression
        catch (err) {
            res.json({ status: 500, msg: "Echec de la suppression de la catégorie" })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveOneProductCategory,
        getOneProductCategory,
        getAllProductCategories,
        getOneProductCategoryWithProducts,
        updateOneProductCategory,
        deleteOneProductCategory
    }
}
