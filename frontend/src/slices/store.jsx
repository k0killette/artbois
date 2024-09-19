import { configureStore } from "@reduxjs/toolkit"

// On importe nos slices pour les injecter dans le store
import basketReducer from './basketSlice'
import productReducer from "./productSlice"
import userReducer from "./userSlice"

const store = configureStore({
    reducer: {
        basket: basketReducer,
        products: productReducer,
        user: userReducer
    }
})

export default store
