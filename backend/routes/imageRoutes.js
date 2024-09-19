const withAuthAdmin = require("../middleware/withAuthAdmin")

module.exports = (app, db) => {
    const ImageModel = require("../models/ImageModel")(db)
    const imageController = require("../controllers/imageController")(ImageModel)

    // Route d'enregistrement d'une image
    app.post("/api/artbois/images/save", withAuthAdmin, imageController.saveOneImage)
    
    // Route de récupération d'une image
    app.get("/api/artbois/images/:id", withAuthAdmin, imageController.getOneImage)
    
    // Route de récupération des images
    app.get("/api/artbois/images", withAuthAdmin, imageController.getAllImages)

    // Route de modification d'une image
    app.put("/api/artbois/images/update/:id", withAuthAdmin, imageController.updateOneImage)

    // Route de suppression d'une image
    app.delete("/api/artbois/images/delete/:id", withAuthAdmin, imageController.deleteOneImage)
}