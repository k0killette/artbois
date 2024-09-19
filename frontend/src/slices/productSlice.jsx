import { createSlice } from "@reduxjs/toolkit"

// Initialisation de l'état initial (state), par défaut c'est un tableau vide de produits car le panier n'a pas encore été rempli
const initialState = {
    products: []
}

// Création du slice "productSlice" avec la fonction createSlice pour définir l'état initial et les actions (reducers) qui peuvent le modifier
export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        getAllProducts: (state, action) => { // Cette fonction permet de mettre à jour le state "products" avec les produits reçus en payload
            state.products = action.payload
        }
    }
})

// Export des actions
export const { getAllProducts } = productSlice.actions
export const selectProducts = (state) => state.products
export default productSlice.reducer