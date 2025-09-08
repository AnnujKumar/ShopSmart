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
    const fetchCart = async () => {
      if (!token) {
        setCartItems([]);
        setCartCount(0);
        return;
      }
      
      try {
        const response = await apiClient.get('/cart');
        if (response.data && response.data.items) {
          setCartItems(response.data.items);
          setCartCount(response.data.items.length);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    
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
  // Handlers for cart operations to keep cart state in sync
  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.product._id !== productId));
    setCartCount(prev => prev - 1);
  };
  
  const handleUpdateQuantity = (productId, quantity) => {
    // Only updating local state, API call is handled in the Cart component
    setCartItems(prev => prev.map(item => 
      item.product._id === productId ? {...item, quantity} : item
    ));
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Products</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={token => { setToken(token); localStorage.setItem('token', token) }} />} />
        <Route path="/cart" element={
          <Cart 
            token={token} 
            onRemoveItem={handleRemoveItem} 
            onUpdateQuantity={handleUpdateQuantity}
            initialCartItems={cartItems}
          />
        } />
        <Route path="/" element={<ProductList addToCart={addToCart} />} />
      </Routes>
    </Router>
  )
}
