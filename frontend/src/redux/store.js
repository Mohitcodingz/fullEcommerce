import { configureStore } from "@reduxjs/toolkit"
import cartReducer from '../redux/cartSlice'
const store = configureStore({
    reducer: {
        cart: createReducerer
    },
})

export default store