/*
productController.js : ce contrôleur gère les opérations liées aux produits, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

module.exports = (ProductModel) => {

    // Enregistre un nouveau produit dans la base de données
    const saveProduct = async(req, res) => {
        try {
            // Appel au modèle pour enregistrer le produit
            const product = await ProductModel.saveOneProduct(req)
            // En cas d'erreur lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (product.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement du produit" })
            }
            // Si l'enregistrement est réussi, renvoie une réponse avec un statut 200 (OK) et les données du produit
            else {
                res.json({ status: 200, msg: "Nouveau produit enregistré" })
            }
        }
        // Gestion des erreurs globales lors de l'enregistrement
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement du produit" })
        }
    }

    // Récupère un produit par son id
    const getOneProduct = async(req, res) => {
        try {
            // Appel au modèle pour récupérer le produit par son id
            const result = await ProductModel.getOneProduct(req.params.id)
            // Si aucun produit n'est trouvé, renvoie une réponse avec un statut 404 (Not Found)
            if (result.length === 0) {
                return res.json({ status: 404, msg: "Produit non trouvé" });
            }
            // Sinon transforme les chaînes concaténées (images_url et images_alt) en tableaux
            else {
                // Prend le premier élément (car il ne devrait y avoir qu'un seul produit correspondant à l'id)
                const product = result[0]
                // Si des images sont présentes, transforme la chaîne concaténée en tableau, sinon renvoie un tableau vide
                product.images_url = product.images_url ? product.images_url.split(',') : []
                // Si des alt sont présents, transforme la chaîne concaténée en tableau, sinon renvoie un tableau vide
                product.images_alt = product.images_alt ? product.images_alt.split(',') : []
                // Renvoie la réponse avec le produit et ses images avec un statut 200 (OK)
                res.json({ status: 200, result: product })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération du produit" })
        }
    }

    // Récupère tous les produits
    const getAllProducts = async(req, res) => {
        try {
            // Appel au modèle pour récupérer tous les produits
            const results = await ProductModel.getAllProducts()
            // Si aucun produit n'est trouvé, renvoie une erreur avec un statut 404 (Not Found)
            if (results.length === 0) {
                return res.json({ status: 404, msg: "Aucun produit n'a été trouvé" })
            }
            // Sinon transforme les chaînes concaténées (images_url et images_alt) en tableaux pour chaque produit
            else {
                // Boucle sur chaque produit
                const products = results.map(article => ({
                    ...article, 
                    images_url: article.images_url ? article.images_url.split(',') : [],
                    images_alt: article.images_alt ? article.images_alt.split(',') : []
                }))
                    // ... est un opérateur de décomposition (spread operator), il permet de "décomposer" un objet ou un tableau et de récupérer toutes ses propriétés ou éléments. 
                    // Avec ...article on crée une copie de l'objet article, en incluant toutes ses propriétés sans les modifier, et ensuite on peut ajouter ou modifier des propriétés spécifiques, comme images_url et images_alt
                    // On pourrait aussi créer directement l'objet article avec toutes ses propriétés, et modifier celles que l'on souhaite :
                    /* return {
                        id: article.id,
                        name: article.name,
                        description: article.description,
                        category_id: article.category_id,
                        stock: article.stock,
                        price: article.price,
                        length: article.length,
                        width: article.width,
                        height: article.height,
                        weight: article.weight,
                        created_at: article.created_at,
                        images_url: article.images_url ? article.images_url.split(',') : [],
                        images_alt: article.images_alt ? article.images_alt.split(',') : []
                    } */
                // Renvoie la réponse avec tous les produits et leurs images avec un statut 200 (OK)
                res.json({ status: 200, result: products })
            }
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des produits" })
        }
    }

    // Met à jour un produit par son id
    const updateProduct = async(req, res) => {
        try {
            // Appel au modèle pour mettre à jour le produit
            const updatedProduct = await ProductModel.updateOneProduct(req, req.params.id)
            // Si une erreur survient lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (updatedProduct.code) {
                return res.json({ status: 500, msg: "Erreur lors de la mise à jour du produit" })
            }
            // Si la mise à jour est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Produit mis à jour" })
            }
        }
        // Gestion des erreurs lors de la mise à jour
        catch (err) {
            res.json({ status: 500, msg: "Echec de la mise à jour du produit" })
        }
    }

    // Supprime un produit par son id
    const deleteProduct = async(req, res) => {
        try {
            // Appel au modèle pour supprimer le produit
            const deletedProduct = await ProductModel.deleteOneProduct(req.params.id)
            // En cas d'erreur lors de la suppression, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (deletedProduct.code) {
                return res.json({ status: 500, msg: "Erreur lors de la suppression du produit" })
            }
            // Si la suppression est réussie, renvoie une réponse avec un statut 200 (OK)
            else {
                res.json({ status: 200, msg: "Produit supprimé" })
            }
        }
        // Gestion des erreurs lors de la suppression
        catch (err) {
            res.json({ status: 500, msg: "Echec de la suppression du produit" })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveProduct,
        getOneProduct,
        getAllProducts,
        updateProduct,
        deleteProduct
    }
}
