// Ce fichier utilitaire permet de centraliser le calcul du poids et des frais d'expédition, il peut être utilisé dans plusieurs modèles ou contrôleurs sans avoir à dupliquer le code

module.exports = {
    // Fonction pour calculer les frais d'expédition en fonction du poids
    calculateShippingCost(totalWeight) {
        if (totalWeight < 250) { // Le poids est exprimé en grammes
            return 4.99 // Frais d'expédition pour un colis léger
        } 
        else if (totalWeight < 500) { 
            return 6.99 
        } 
        else { 
            return 8.80
        }
    },
    
    // Fonction pour calculer le poids total d'une ligne de commande
    calculateTotalWeight(quantity, productWeight) {
        return quantity * parseFloat(productWeight);
    }
}
