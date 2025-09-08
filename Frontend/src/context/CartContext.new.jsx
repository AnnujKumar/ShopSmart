import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import apiClient from '../api/axios';

// Create context
const CartContext = createContext();

// Initial state
const initialState = {
  items: [],
  isLoading: true,
  error: null
};

// Calculate total price from cart items
const calculateTotalPrice = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

// Cart reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { 
        ...state, 
        isLoading: true, 
        error: null 
      };
      
    case 'LOAD_ERROR':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      };
      
    case 'LOAD_SUCCESS':
      return { 
        ...state, 
        items: action.payload, 
        isLoading: false, 
        error: null 
      };
      
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      };
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product._id !== action.payload),
        isLoading: false,
        error: null
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.product._id === action.payload.productId 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        ),
        isLoading: false,
        error: null
      };
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        isLoading: false,
        error: null
      };
      
    default:
      return state;
  }
};

// Cart Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const token = localStorage.getItem('token');

  // Calculate total price
  const totalPrice = state.items.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );
  
  // Update navbar cart counter
  const updateNavbarCounter = useCallback(() => {
    const cartLink = document.getElementById('cartLink');
    if (cartLink) {
      cartLink.textContent = `Cart (${state.items.length})`;
    }
  }, [state.items.length]);
  
  // Fetch cart data from API
  const fetchCart = useCallback(async () => {
    if (!token) {
      dispatch({ type: 'LOAD_SUCCESS', payload: [] });
      return;
    }
    
    dispatch({ type: 'LOADING' });
    
    try {
      const response = await apiClient.get('/cart');
      
      if (response.data && response.data.items && Array.isArray(response.data.items)) {
        // Filter valid items
        const validItems = response.data.items.filter(
          item => item && item.product && item.product._id && item.quantity
        );
        
        dispatch({ type: 'LOAD_SUCCESS', payload: validItems });
      } else {
        dispatch({ type: 'LOAD_SUCCESS', payload: [] });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ 
        type: 'LOAD_ERROR', 
        payload: 'Failed to load your cart. Please try again.' 
      });
    }
  }, [token]);
  
  // Add item to cart
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!token) {
      console.error('User must be logged in to add items to cart');
      dispatch({ 
        type: 'LOAD_ERROR', 
        payload: 'You must be logged in to add items to cart' 
      });
      return false;
    }
    
    dispatch({ type: 'LOADING' });
    
    try {
      const response = await apiClient.post('/cart/add', { productId, quantity });
      
      if (response.data && response.data.items && Array.isArray(response.data.items)) {
        const validItems = response.data.items.filter(
          item => item && item.product && item.product._id && item.quantity
        );
        
        dispatch({ type: 'LOAD_SUCCESS', payload: validItems });
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error adding item to cart:', err);
      dispatch({ 
        type: 'LOAD_ERROR', 
        payload: 'Failed to add item to cart. Please try again.' 
      });
      return false;
    }
  }, [token]);
  
  // Remove item from cart
  const removeFromCart = useCallback(async (productId) => {
    if (!token) return false;
    
    // Optimistic update - remove item immediately from UI
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    
    try {
      await apiClient.post('/cart/remove', { productId });
      return true;
    } catch (err) {
      console.error('Error removing item from cart:', err);
      // If API call fails, refresh cart to get actual state
      fetchCart();
      return false;
    }
  }, [token, fetchCart]);
  
  // Update item quantity
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!token || quantity < 1) return false;
    
    // Optimistic update - update quantity immediately in UI
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { productId, quantity } 
    });
    
    try {
      await apiClient.post('/cart/update', { productId, quantity });
      return true;
    } catch (err) {
      console.error('Error updating quantity:', err);
      // If API call fails, refresh cart to get actual state
      fetchCart();
      return false;
    }
  }, [token, fetchCart]);
  
  // Clear cart
  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });
    // No API endpoint for clearing cart, just clear local state
  }, []);
  
  // Initialize cart when component mounts or token changes
  useEffect(() => {
    console.log('CartContext: Initializing with token:', !!token);
    fetchCart();
  }, [token, fetchCart]);
  
  // Update navbar counter whenever cart items change
  useEffect(() => {
    updateNavbarCounter();
  }, [updateNavbarCounter]);
  
  // Provide value to consuming components
  const contextValue = {
    cart: state.items,
    isLoading: state.isLoading,
    error: state.error,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart: fetchCart
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}
