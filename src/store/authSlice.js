import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../utils/authService';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    loading: false,
    token: localStorage.getItem('token'),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Async actions
export const registerUser = (email, password, name) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authService.register(email, password, name);
    dispatch(setUser(response));
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    throw error;
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authService.login(email, password);
    dispatch(setUser(response));
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    throw error;
  }
};

export const logoutUser = () => async (dispatch) => {
  dispatch(logout());
};

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;