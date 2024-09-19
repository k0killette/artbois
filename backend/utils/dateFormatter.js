// Ce fichier utilitaire permet de gérer l'affichage des dates de création ou de mise à jour (compte, commande, produit, news...). Le formatage des dates permettra d'avoir un affichage cohérent dans toute l'application.

const moment = require('moment')

module.exports = {
    formatDate(date) {
        return moment(date).format('DD/MM/YYYY') // Format personnalisé selon l'écriture habituelle française
    },
    
    formatDateTimefunction(date) {
        return moment(date).format('DD/MM/YYYY HH:mm') // Format date + heure
    }
}
