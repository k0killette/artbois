import {createSlice} from "@reduxjs/toolkit"

// Initialisation du panier depuis le localStorage, ou création d'un panier vide s'il n'existe pas
let lsBasket = JSON.parse(window.localStorage.getItem("artbois-basket"))
// S'il n'y a pas de panier dans le storage 
if(lsBasket === null){
    // On initialise un panier vide
    lsBasket = []
}

// On crée une fonction qui va calculer le prix total du panier (on boucle à l'intérieur pour additionner les prix de chaque ligne)
const calculateTotalAmount = (basket) => {
    let price = 0
    basket.forEach((product) => {
        price += parseInt(product.quantityInCart) * parseFloat(product.price)
    })
    return price
}

/*
On initialise une state : 
    - soit on aura basket avec un tableau d'objet et totalPrice avec la somme totale
    - soit on aura basket avec un tableau vide et totalPrice à zero
*/
const initialState = {
    basket: lsBasket,
    totalAmount: calculateTotalAmount(lsBasket)
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        // Action pour modifier le panier et recalculer le total
        updateBasket: (state, action) => {
            // On met à jour le panier avec les nouveaux produits
            state.basket = action.payload
            // On rRecalcule le prix total avec les nouveaux produits
            state.totalAmount = calculateTotalAmount(state.basket)
            // Sauvegarde du panier dans le localStorage
            window.localStorage.setItem("artbois-basket", JSON.stringify(state.basket))
        },
        // Action pour vider le panier
        cleanBasket: (state) => {
            state.basket = []
            state.totalAmount = 0
            // Mise à jour du localStorage
            window.localStorage.setItem("artbois-basket", JSON.stringify([]))
        }
    }
})

export const { updateBasket, cleanBasket } = basketSlice.actions
export const selectBasket = (state) => state.basket
export default basketSlice.reducer
