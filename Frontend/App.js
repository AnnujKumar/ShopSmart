import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import Cart from './pages/Cart'
import apiClient from './src/api/axios.js'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  
  // Fetch cart when the component mounts or token changes
  useEffect(() => {
    // Reset cart counter shown in UI to match actual cart state
    const resetCartCounterInUI = () => {
      // Get the cart element in the navbar
      const cartCounter = document.querySelector('.navbar a[href="/cart"]');
      if (cartCounter) {
        // Set the text to just "Cart" without any count
        cartCounter.textContent = 'Cart (0)';
      }
    };
    
    const fetchCart = async () => {
      if (!token) {
        console.log('No token available, clearing cart state');
        setCartItems([]);
        setCartCount(0);
        resetCartCounterInUI();
        return;
      }
      
      try {
        console.log('App: Fetching cart data with token:', token.substring(0, 10) + '...');
        const response = await apiClient.get('/cart');
        console.log('App: Cart API response:', response);
        
        if (response.data && response.data.items && Array.isArray(response.data.items)) {
          console.log('App: Cart items received:', response.data.items);
          // Verify each item has a valid product property
          const validItems = response.data.items.filter(item => 
            item && item.product && item.product._id && item.quantity
          );
          
          console.log('App: Valid cart items:', validItems);
          setCartItems(validItems);
          setCartCount(validItems.length);
          
          // Update UI directly as a backup
          const cartCounter = document.querySelector('.navbar a[href="/cart"]');
          if (cartCounter) {
            cartCounter.textContent = `Cart (${validItems.length})`;
          }
        } else {
          console.warn('App: Empty or invalid cart data received');
          setCartItems([]);
          setCartCount(0);
          resetCartCounterInUI();
        }
      } catch (error) {
        console.error('App: Error fetching cart:', error);
        console.error('App: Error details:', { 
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        // On error, reset state
        setCartItems([]);
        setCartCount(0);
        resetCartCounterInUI();
      }
    };
    
    console.log('App: Token changed, fetching cart');
    fetchCart();
  }, [token]);
  
  const addToCart = async productId => {
    if (!token) {
      // Handle unauthenticated state
      console.error('User must be logged in to add items to cart');
      return;
    }
    
    try {
      const response = await apiClient.post('/cart/add', { productId, quantity: 1 });
      
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
        setCartCount(response.data.items.length);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }
  // Debug current cart state
  useEffect(() => {
    console.log('App: Current cartItems state:', cartItems);
    console.log('App: Current cartCount:', cartCount);
  }, [cartItems, cartCount]);

  // Handlers for cart operations to keep cart state in sync
  const handleRemoveItem = (productId) => {
    console.log('App: Removing item from cart:', productId);
    setCartItems(prev => prev.filter(item => item.product._id !== productId));
    setCartCount(prev => prev - 1);
  };
  
  const handleUpdateQuantity = (productId, quantity) => {
    console.log('App: Updating item quantity:', { productId, quantity });
    // Only updating local state, API call is handled in the Cart component
    setCartItems(prev => prev.map(item => 
      item.product._id === productId ? {...item, quantity} : item
    ));
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Products</Link>
        <Link to="/cart" id="cartLink">Cart ({cartItems?.length || 0})</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={token => { setToken(token); localStorage.setItem('token', token) }} />} />
        <Route path="/cart" element={
          (() => {
            console.log('App: Rendering Cart with initialCartItems:', cartItems);
            return (
              <Cart 
                token={token} 
                onRemoveItem={handleRemoveItem} 
                onUpdateQuantity={handleUpdateQuantity}
                initialCartItems={cartItems}
              />
            );
          })()
        } />
        <Route path="/" element={<ProductList addToCart={addToCart} />} />
      </Routes>
    </Router>
  )
}
