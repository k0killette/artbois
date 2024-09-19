const withAuthAdmin = require("../middleware/withAuthAdmin")

module.exports = (app, db) => {
    const NewsModel = require("../models/NewsModel")(db)
    const newsController = require("../controllers/newsController")(NewsModel)

    // Route d'enregistrement d'une actu
    app.post("/api/artbois/news/save", withAuthAdmin, newsController.saveNews)
    
    // Route de récupération d'une actu
    app.get("/api/artbois/news/:id", newsController.getOneNews)

    // Route de modification d'une actu
    app.put("/api/artbois/news/update/:id", withAuthAdmin, newsController.updateOneNews)

    // Route de suppression d'une actu
    app.delete("/api/artbois/news/delete/:id", withAuthAdmin, newsController.deleteOneNews)
}