/*
productImageController.js : ce contrôleur gère les opérations liées aux images des produits, notamment la sauvegarde, la récupération, la mise à jour et la suppression (méthode CRUD - Create Read Update Delete).
*/

// Module pour interagir avec le système de fichiers
const fs = require('fs')
// Module pour gérer les chemins de fichiers
const path = require('path')
// Module utilitaire pour la validation des images
const imageValidation = require('../utils/imageValidation')

module.exports = (ProductImageModel) => {

    // Enregistr une image d'un produit
    const saveOneProductImage = async(req, res) => {
        try {
            // Fichier envoyé via le champ "image"
            const file = req.files?.image 
            // Vérifie la présence du fichier
            if (!file) {
                return res.json({ status: 400, msg: "Aucun fichier n'a été téléchargé" })
            }
            // Vérifie le poids du fichier
            if (!imageValidation.checkFileSize(file, imageValidation.maxSize)) {
                return res.json({ status: 400, msg: "Le fichier dépasse la taille maximale de 2 Mo" });
            }
            // Vérifie l'extension du fichier
            if (!imageValidation.checkFileExtension(file)) {
                return res.json({ status: 400, msg: "Type de fichier non autorisé, veuillez télécharger une image" })
            }
            // Vérifie le contenu du fichier (type MIME)
            if (!await imageValidation.checkMimeType(file)) {
                return res.json({ status: 400, msg: "Le fichier téléchargé n'est pas valide" })
            }
            // Génère un nom de fichier unique
            const uniqueFileName = imageValidation.generateUniqueFileName(file)
            // Déplace le fichier vers le répertoire cible
            const imageUrl = await imageValidation.moveFile(file, 'product_images', uniqueFileName)
            // Appel au modèle pour enregistrer l'image dans la base de données
            const savedImage = await ProductImageModel.saveOneProductImage({
                product_id: req.body.product_id,
                image_url: imageUrl,
                alt: req.body.alt
            })
            // En cas d'erreur lors de l'enregistrement, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (savedImage.code) {
                return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de l'image dans la base de données" })
            }
            // Si l'enregistrement est réussi, renvoie une réponse avec un statut 200 (OK) et l'url de l'image
            res.json({ status: 200, msg: "Image téléchargée et enregistrée avec succès", url: imageUrl })
        }
        // Gestion des erreurs globales lors du téléchargement
        catch (err) {
            res.json({ status: 500, msg: "Erreur lors du téléchargement de l'image", error: err })
        }
    }

    // Récupère une image par son id
    const getOneProductImage = async(req, res) => {
        try {
            // Appel au modèle pour récupérer l'image par son id
            const image = await ProductImageModel.getOneProductImage(req.params.id)
            // Si erreur lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (image.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de l'image" })
            }
            // Renvoie la réponse avec un statut 200 (OK) et l'image
            res.json({ status: 200, result: image })
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération de l'image", error: err })
        }
    }

    // Récupère les images liées à un produit
    const getImagesByProductId = async(req, res) => {
        try {
            // Appel au modèle pour récupérer les images d'un produit
            const images = await ProductImageModel.getImagesByProductId(req.params.productId)
            // Si erreur lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (images.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des images du produit" })
            }
            // Renvoie la réponse avec les images du produit avec un statut 200 (OK)
            res.json({ status: 200, result: images })
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des images du produit", error: err })
        }
    }

    // Récupère toutes les images de produits
    const getAllProductsImages = async(req, res) => {
        try {
            // Appel au modèle pour récupérer toutes les images des produits
            const images = await ProductImageModel.getAllProductsImages()
            // Si erreur lors de la récupération, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (images.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des images des produits" })
            }
            // Renvoie la réponse avec toutes les images des actualités avec un statut 200 (OK)
            res.json({ status: 200, result: images })
        }
        // Gestion des erreurs lors de la récupération
        catch (err) {
            res.json({ status: 500, msg: "Erreur lors de la récupération des images des produits", error: err })
        }
    }

    // Met à jour une image d'un produit
    const updateOneProductImage = async(req, res) => {
        try {
            // Appel au modèle pour mettre à jour l'image
            const image = await ProductImageModel.updateOneProductImage(req.body, req.params.id)
            // Si erreur lors de la mise à jour, renvoie une réponse avec un statut 500 (Internal Server Error)
            if (image.code) {
                return res.json({ status: 500, msg: "Erreur lors de la mise à jour des métadonnées de l'image" })
            }
            // Si la mise à jour est réussie, renvoie une réponse avec un statut 200 (OK)
            res.json({ status: 200, msg: "Métadonnées de l'image mises à jour avec succès" })
        }
        // Gestion des erreurs lors de la mise à jour
        catch (err) {
            res.json({ status: 500, msg: "Erreur lors de la mise à jour des métadonnées de l'image", error: err })
        }
    }

    // Supprime une image d'un produit par son id
    const deleteOneProductImage = async(req, res) => {
        try {
            // Appel au modèle pour supprimer l'image
            const image = await ProductImageModel.getOneProductImage(req.params.id)
            // Si aucune image n'est trouvée, renvoie une erreur avec un statut 404 (Not Found)
            if (image.length === 0) {
                return res.json({ status: 404, msg: "Image non trouvée" })
            }
            // Détermine le chemin complet de l'image sur le serveur
            const imagePath = path.join(__dirname, '..', image[0].image_url)
            // Vérifie si le fichier existe avant de le supprimer
            if (!fs.existsSync(imagePath)) {
                return res.json({ status: 404, msg: "Fichier non trouvé à l'emplacement spécifié" });
            }
            // Supprime le fichier sur le serveur
            fs.unlink(imagePath, async(err) => {
                // En cas d'erreur lors de la suppression, renvoie une réponse avec un statut 500 (Internal Server Error)
                if (err) {
                    return res.json({ status: 500, msg: "Erreur lors de la suppression du fichier", error: err })
                }
                // Supprime l'enregistrement dans la base de données
                const deletedImage = await ProductImageModel.deleteOneProductImage(req.params.id)
                // En cas d'erreur lors de la suppression, renvoie une réponse avec un statut 500 (Internal Server Error)
                if (deletedImage.code) {
                    return res.json({ status: 500, msg: "Erreur lors de la suppression de l'image dans la base de données", error: deletedImage })
                }
                // Si la suppression est réussie, renvoie une réponse avec un statut 200 (OK)
                res.json({ status: 200, msg: "Image supprimée avec succès" })
            })
        }
        // Gestion des erreurs lors de la suppression
        catch (err) {
            res.json({ status: 500, msg: "Erreur lors de la suppression de l'image", error: err })
        }
    }
    
    // Retourne les méthodes du contrôleur pour les utiliser dans les routes
    return {
        saveOneProductImage,
        getOneProductImage,
        getImagesByProductId,
        getAllProductsImages,
        updateOneProductImage,
        deleteOneProductImage
    }
}
