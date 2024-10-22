/* 
Ce fichier utilitaire permet de réaliser plusieurs vérifications lors de l'upload d'une image.
*/

const path = require('path') // Module natif de Node.js utilisé pour gérer les chemins de fichiers et répertoires
const { v4: uuidv4 } = require('uuid') // Bibliothèque pour générer des identifiants uniques (UUID version 4) pour éviter les collisions de noms lors de l'enregistrement des fichiers
const fileType = require('file-type') // Bibliothèque pour déterminer le type MIME d'un fichier à partir de son contenu binaire

const maxSize = 2 * 1024 * 1024 // Taille maximale du fichier définie à 2 Mo
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'] // Extensions de fichier autorisées

const imageValidation = {
    maxSize, // Export de maxSize pour qu'il puisse être utilisé dans les contrôleurs
    allowedExtensions, // Export de allowedExtensions pour qu'il puisse être utilisé dans les contrôleurs

    // Vérification de la taille du fichier 
    checkFileSize(file) {
        return file.size <= this.maxSize // Renvoie true si la taille du fichier est inférieure ou égale à la taille maximale autorisée
    },

    // Vérification de l'extension du fichier
    checkFileExtension(file) {
        const fileExtension = path.extname(file.name).toLowerCase() // Récupère l'extension du fichier et la convertit en minuscules pour éviter des erreurs dûes à la syntaxe
        return this.allowedExtensions.includes(fileExtension) // Renvoie true si l'extension fait partie des extensions autorisées
    },

    // Vérification du type MIME du fichier (contenu) pour confirmer qu'il correspond à une image
    async checkMimeType(file) {
        const buffer = file.data // Contenu réel du fichier (contenu binaire)
        const type = await fileType.fromBuffer(buffer) // Utilise la librairie fileType pour analyser le buffer et déterminer le type réel du fichier
        return type && this.allowedExtensions.includes(`.${type.ext}`) // Renvoie true si le type MIME correspond à une extension autorisée
    },

    // Génération d'un nom de fichier unique à l'aide de l'UUID
    generateUniqueFileName(file) {
        const fileExtension = path.extname(file.name).toLowerCase() // Récupère l'extension du fichier
        return uuidv4() + fileExtension //idem `${uuidv4()}${fileExtension}`, génère un nom unique en ajoutant l'extension au UUID
    },

    // Déplacement du fichier vers le répertoire cible (opération asynchrone)
    // file = fichier à déplacer, directory = répertoire de destination, uniqueFileName = nom unique généré pour le fichier
    async moveFile(file, directory, uniqueFileName) { 
        const uploadPath = path.join('public', directory, uniqueFileName) // path.join combine les segments du chemin pour obtenir l'emplacement final du fichier 
        await file.mv(uploadPath) // file.mv sert à déplacer le fichier téléchargé vers son emplacement final (défini par uploadPath)
        const imageUrl = `/public/${directory}/${uniqueFileName}`
        return imageUrl // On retourne l'URL relative du fichier
    }
}

module.exports = imageValidation
