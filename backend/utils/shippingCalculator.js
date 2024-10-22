/*
Ce fichier utilitaire permet de centraliser le calcul du poids total et des frais d'expédition. 
Il peut être utilisé dans les modèles ou contrôleurs sans avoir à dupliquer le code.
*/

// Création d'un tableau des paliers de frais d'expédition en fonction du poids maximal (exprimé en grammes)
const shippingRates = [
    { maxWeight: 250, cost: 4.99 },
    { maxWeight: 500, cost: 6.99 },
    { maxWeight: 1000, cost: 8.80 },
    { maxWeight: Infinity, cost: 12.99 } // Frais d'expédition pour des poids > 1000g 
]

module.exports = {
    
    // Fonction pour calculer les frais d'expédition en fonction du poids total de la commande
    calculateShippingCost(totalWeight) {
        // Utilisation de la méthode find() pour chercher dans le tableau shippingRates l'objet correspondant à la première condition où le poids total de la commande (totalWeight) est inférieur ou égal à la valeur de maxWeight
        // find() renvoie le premier objet dont la condition est vraie
        // console.log("Poids total de la commande dans shippingCalculator : ", totalWeight)
        const rate = shippingRates.find(rate => totalWeight <= rate.maxWeight)
        
        // Si un palier est trouvé : retourne le coût 
        if (rate) {
            return rate.cost 
        }
        // Si aucun palier n'est trouvé : lève une erreur
        else {
            throw new Error("Aucun palier de frais de livraison trouvé pour ce poids")
        }
    },

    // Fonction pour calculer le poids total d'une ligne de commande (quantité * poids d'un produit)
    calculateTotalWeight(quantity, productWeight) {
        return quantity * parseFloat(productWeight) 
    }
}
