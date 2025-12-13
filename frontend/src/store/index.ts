// /KrishiDirect/KrishiDirect/frontend/src/store/index.ts

import { createStore } from 'redux';

// Initial state for the store
const initialState = {
    user: null,
    products: [],
};

// Action types
const SET_USER = 'SET_USER';
const SET_PRODUCTS = 'SET_PRODUCTS';

// Action creators
export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const setProducts = (products) => ({
    type: SET_PRODUCTS,
    payload: products,
});

// Reducer function
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case SET_PRODUCTS:
            return {
                ...state,
                products: action.payload,
            };
        default:
            return state;
    }
};

// Create the Redux store
const store = createStore(rootReducer);

export default store;