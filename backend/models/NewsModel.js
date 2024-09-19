module.exports = (_db) => {
    db = _db
    return NewsModel
}

class NewsModel {

    // Sauvegarde d'une nouvelle actualité
    static saveOneNews(req) {
        return db.query('INSERT INTO news (title, image_url, alt, content, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())', [req.body.title, req.body.image_url, req.body.alt, req.body.content, req.body.status])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }

    // Récupération d'une actualité par son id
    static getOneNews(id) {
        return db.query('SELECT * FROM news WHERE id = ?', [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    // Récupération d'une actualité par son titre. On utilisera le caractère % (wildcard) et l'opérateur LIKE pour effectuer une recherche partielle dans une colonne (si le searchTerm est "Actu", la requête SQL cherchera tous les titres qui contiennent "Actu", comme "Nouvelle Actu", "Actualité", etc.)
    static getOneNewsByTitle(searchTerm) {
        return db.query('SELECT * FROM news WHERE title LIKE ?', [`%${searchTerm}%`]) // `%` représente zéro, un ou plusieurs caractères 
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })        
    }
    
    // Récupération de toutes les actualités
    static getAllNews() {
        return db.query('SELECT * FROM news')
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    // Mise à jour d'une actualité par son id
    static updateOneNews(req, id) {
        return db.query('UPDATE news SET title = ?, image_url = ?, alt = ?, content = ?, status = ? WHERE id = ?', [req.body.title, req.body.image_url, req.body.alt, req.body.content, req.body.status, id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }

    // Suppression d'une actualité par son id
    static deleteOneNews(id) {
        return db.query('DELETE FROM news WHERE id = ?', [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
}
