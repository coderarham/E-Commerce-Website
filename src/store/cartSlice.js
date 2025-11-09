import { createSlice } from '@reduxjs/toolkit';
import { cartService } from '../utils/cartService';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    loading: false
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.total = action.payload.totalAmount || 0;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

// Async actions
export const loadCart = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const cart = await cartService.getCart(userId);
    dispatch(setCart(cart));
  } catch (error) {
    console.error('Load cart error:', error);
    dispatch(setLoading(false));
  }
};

export const addToCart = (userId, product, size) => async (dispatch) => {
  try {
    const cart = await cartService.addItem(userId, product, size);
    dispatch(setCart(cart));
  } catch (error) {
    console.error('Add to cart failed:', error);
  }
};

export const updateQuantity = (userId, productId, size, quantity) => async (dispatch) => {
  try {
    const cart = await cartService.updateQuantity(userId, productId, size, quantity);
    dispatch(setCart(cart));
  } catch (error) {
    console.error('Update quantity failed:', error);
  }
};

export const removeFromCart = (userId, productId, size) => async (dispatch) => {
  try {
    const cart = await cartService.removeItem(userId, productId, size);
    dispatch(setCart(cart));
  } catch (error) {
    console.error('Remove from cart failed:', error);
  }
};

export const clearCart = (userId) => async (dispatch) => {
  try {
    const cart = await cartService.clearCart(userId);
    dispatch(setCart(cart));
  } catch (error) {
    console.error('Clear cart failed:', error);
  }
};

export const { setCart, setLoading } = cartSlice.actions;
export default cartSlice.reducer;