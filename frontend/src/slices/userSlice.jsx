import {createSlice} from "@reduxjs/toolkit"

// On crée notre state initiale, par défaut c'est un objet vide pour infos et false pour isLogged
const initialState = {
    infos: {},
    isLogged: false
}

// On crée la state
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        connectUser: (state, action) => {
            state.infos = action.payload
            state.isLogged = true
        },
        logoutUser: (state) => {
            state.infos = {}
            state.isLogged = false
        }
    }
})

export const { connectUser, logoutUser } = userSlice.actions
export const selectUser = (state) => state.user
export default userSlice.reducer
