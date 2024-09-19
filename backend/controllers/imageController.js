const fs = require("fs")

module.exports = (ImageModel) => {

    const saveOneImage = async(req, res) => {
        
        // On définit les types de fichiers autorisés et la taille maximale autorisée en octets (2Mo)
        const allowedImagesTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
        const allowedMaxSize = 2 * 1024 * 1024
        
        // On vérifie si un fichier a bien été envoyé
        if (req.files && req.files.image) {
            const imageFile = req.files.image
            // On doit vérifier l'extension et comparer avec celles autorisées
            console.log(imageFile.mimetype)
            
            // On vérifie le type du fichier envoyé (mimetype permet de vérifier le type MIME du fichier)
            if (allowedImagesTypes.includes(imageFile.mimetype)) {
                
                // On vérifie la taille du fichier envoyé (size permet de vérifier la taille du fichier)
                if (imageFile.size <= allowedMaxSize) {
                    try {
                        // On insère l'image téléchargée dans le dossier `public/images/`
                        const filePath = `public/images/${imageFile.name}`
                        await imageFile.mv(filePath) // `mv`= move
                        
                        // On sauvegarde les informations de l'image dans la base de données
                        const savedImage = await ImageModel.saveOneImage(req)
                        if (savedImage.code) {
                            return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de l'image" })
                        }
                        else {
                            res.json({ status: 200, msg: "Image enregistrée" })
                        }
                    }
                    catch (err) {
                        res.json({ status: 500, msg: "Echec de l'enregistrement de l'image" })
                    }
                }
                // Si le fichier est trop volumineux on retourne une erreur
                else {
                    return res.json({ status: 400, msg: "Fichier trop volumineux"})
                }
            }
            // Si le type de fichier n'est pas autorisé on retourne une erreur
            else {
                return res.json({ status: 400, msg: "Type de fichier non autorisé"})
            }
        }
        // Si aucun fichier n'est présent on retourne une erreur
        else {
            return res.json({ status: 400, msg: "Aucun fichier envoyé" })
        }
    }

    const getOneImage = async(req, res) => {
        try {
            const image = await ImageModel.getOneImage(req.params.id)
            if (image.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération de l'image" })
            }
            else {
                res.json({ status: 200, image: image[0] })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération de l'image" })
        }
    }

    const getAllImages = async(req, res) => {
        try {
            const images = await ImageModel.getAllImages()
            if (images.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des images" })
            }
            else {
                res.json({ status: 200, images })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de récupération des images" })
        }
    }

    const updateOneImage = async(req, res) => {
        try {
            const updatedImage = await ImageModel.updateOneImage(req, req.params.id)
            if (updatedImage.code) {
                return res.json({ status: 500, msg: "Erreur lors de la modification de l'image" })
            }
            else {
                res.json({ status: 200, msg: "Image mise à jour" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de modification de l'image" })
        }
    }

    const deleteOneImage = async(req, res) => {
        try {
            const deletedImage = await ImageModel.deleteOneImage(req.params.id)
            if (deletedImage.code) {
                return res.json({ status: 500, msg: "Erreur lors de la suppression de l'image" })
            }
            else {
                res.json({ status: 200, msg: "Image supprimée" })
            }
        }
        catch (err) {
            res.json({ status: 500, msg: "Echec de suppression de l'image" })
        }
    }

    return {
        saveOneImage,
        getOneImage,
        getAllImages,
        updateOneImage,
        deleteOneImage
    }}
