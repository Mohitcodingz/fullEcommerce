import { createSlice } from "@reduxjs/toolkit";

const getSavedCart = () => {
    try {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const initialState = {
    cartItems: getSavedCart()
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const quantityToAdd = Number(item.qty) > 0 ? Number(item.qty) : 1;
            const existItem = state.cartItems.find((x) => x.productId === item.productId);
            
            if (existItem) {
                existItem.qty = (Number(existItem.qty) || 0) + quantityToAdd;
                // keep details updated in case price or image changed
                existItem.price = item.price ?? existItem.price;
                existItem.name = item.name ?? existItem.name;
                existItem.imageUrl = item.imageUrl ?? existItem.imageUrl;
            } else {
                state.cartItems.push({
                    ...item,
                    qty: quantityToAdd
                });
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        updateCartQty: (state, action) => {
            const { productId, qty } = action.payload;
            const newQty = Number(qty);
            if (newQty <= 0) {
                state.cartItems = state.cartItems.filter((x) => x.productId !== productId);
            } else {
                const item = state.cartItems.find((x) => x.productId === productId);
                if (item) {
                    item.qty = newQty;
                }
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((x) => x.productId !== itemId);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        }
    }
});

export const { addToCart, updateCartQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;