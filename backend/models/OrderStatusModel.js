/*
Modèle pour gérer les statuts associés aux commandes dans la base de données.
*/

// Exportation du modèle avec accès à la base de données
module.exports = (_db) => {
    db = _db
    return OrderStatusModel
}

class OrderStatusModel {

    // Sauvegarde d'un nouveau statut de commande avec son nom
    static saveOneOrderStatus(req) {
        return db.query('INSERT INTO order_statuses (status_name) VALUES (?)', [req.body.status_name])
        .then((res) => {
            return res // Retourne le résultat de l'insertion
        })
        .catch((err) => {
            return err // Gère les erreurs lors de l'insertion
        })
    }

    // Récupération d'un statut de commande correspondant à un id spécifique
    static getOneOrderStatus(id) {
        return db.query('SELECT * FROM order_statuses WHERE id = ?', [id])
        .then((res) => {
            return res // Retourne le statut de commande
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }
    
    // Récupération d'un statut de commande avec les commandes associées via une jointure LEFT JOIN
    static getOneOrderStatusWithOrders(orderStatusId) {
        return db.query(`SELECT order_statuses.*, 
                                orders.id AS order_id 
                        FROM order_statuses 
                        LEFT JOIN orders ON order_statuses.id = orders.status_id 
                        WHERE order_statuses.id = ?`, [orderStatusId]) 
        .then((res) => {
            // S'il n'y a aucune commande dans le statut choisi
            if (res.length === 0) {
            return { message: "Aucune commande n'a été trouvée", order: [] }
            }
            return res // Retourne le statut de commande avec les commandes associées
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }
    
    // Récupération de tous les statuts de commande
    static getAllOrderStatuses() {
        return db.query('SELECT * FROM order_statuses')
        .then((res) => {
            return res // Retourne tous les statuts de commande
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la récupération
        })
    }
    
    // Mise à jour d'un statut de commande correspondant à un id spécifique en modifiant son nom
    static updateOneOrderStatus(req, id) {
        return db.query('UPDATE order_statuses SET status_name = ? WHERE id = ?', [req.body.status_name, id])
        .then((res) => {
            return res // Retourne le résultat de la mise à jour
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la mise à jour
        })
    }

    // Suppression d'un statut de commande correspondant à un id spécifique
    static deleteOneOrderStatus(id) {
        return db.query('DELETE FROM order_statuses WHERE id = ?', [id])
        .then((res) => {
            return res // Retourne le résultat de la suppression
        })
        .catch((err) => {
            return err // Gère les erreurs lors de la suppression
        })
    }
}
