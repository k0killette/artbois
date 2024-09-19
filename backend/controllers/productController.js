module.exports = (ProductModel) => {

    // Sauvegarde d'un nouveau produit
    const saveProduct = async(req, res) => {
        try {
            const product = await ProductModel.saveOneProduct(req)
            if (product.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement du produit" })
            }
            else {
                res.json({ status: 200, msg: "Nouveau produit enregistré", data: product })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement du produit" })
        }
    }

    // Récupération d'un produit par son id
    const getOneProduct = async(req, res) => {
        try {
            const product = await ProductModel.getOneProduct(req.params.id)
            if (product.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération du produit" })
            }
            else {
                res.json({ status: 200, result: product[0] })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération du produit" })
        }
    }
    
    // Récupération de tous les produits
    const getAllProducts = async(req, res) => {
        try {
            const products = await ProductModel.getAllProducts()
            if (products.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des produits" })
            }
            else {
                res.json({ status: 200, result: products })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des produits" })
        }
    }

    // Mise à jour d'un produit par son id
    const updateProduct = async(req, res) => {
        try {
            const updatedProduct = await ProductModel.updateOneProduct(req, req.params.id)
            if (updatedProduct.code) {
                return res.json({ status: 500, msg: "Erreur lors de la mise à jour du produit" })
            }
            else {
                res.json({ status: 200, msg: "Produit mis à jour" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la mise à jour du produit" })
        }
    }
    
    // Suppression d'un produit par son id
    const deleteProduct = async(req, res) => {
        try {
            const deletedProduct = await ProductModel.deleteOneProduct(req.params.id)
            if (deletedProduct.code) {
                return res.json({ status: 500, msg: "Erreur lors de la suppression du produit" })
            }
            else {
                res.json({ status: 200, msg: "Produit supprimé" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de la suppression du produit" })
        }
    }

    return {
        saveProduct,
        getOneProduct,
        getAllProducts,
        updateProduct,
        deleteProduct
    }
}
