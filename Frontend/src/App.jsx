import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Signup from '../pages/Signup.jsx'
import Login from '../pages/Login.jsx'
import ProductList from '../pages/ProductList.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import Cart from '../pages/Cart.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import apiClient from './api/axios.js'
import './App.css'
import './components/UserDropdown.css'
import './components/AuthStyles.css'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [cartItems, setCartItems] = useState([])
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const lastScrollY = useRef(0)
  const dropdownRef = useRef(null);
  
  // Verify token validity when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setToken('');
        return;
      }
      
      try {
        // Make a request to a protected endpoint to verify token validity
        await apiClient.get('/users/verify-token');
        // If request succeeds, token is valid
        setToken(storedToken);
      } catch (error) {
        // If request fails, token is invalid or expired
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        setToken('');
      }
    };
    
    verifyToken();
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken('')
    setCartItems([])
    setIsDropdownOpen(false)
    // The user will be redirected to the login page by the ProtectedRoute
  }
  
  // Fetch cart items on component mount and when token changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) {
        setCartItems([]);
        return;
      }
      
      try {
        // No need to pass userId, will be extracted from token
        const response = await apiClient.get('/cart');
        
        if (response.data && response.data.items) {
          // Extract all product IDs from cart items
          const items = response.data.items.map(item => ({
            id: item.product._id,
            quantity: item.quantity
          }));
          setCartItems(items);
        } else {
          // Handle case where response is valid but no items
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Don't reset cart items on error - keep last known state
      }
    };
    
    fetchCartItems();
  }, [token]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const addToCart = async productId => {
    if (!token) {
      alert('Please log in to add items to your cart');
      return;
    }
    
    try {
      // No need to pass userId, will be extracted from token
      const response = await apiClient.post('/cart/add', 
        { productId, quantity: 1 }
      );
      
      if (response.data) {
        // Update UI optimistically
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => item.id === productId);
        
        if (existingItemIndex >= 0) {
          // If item exists, increase quantity
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          setCartItems(updatedItems);
        } else {
          // If item is new, add it to cart
          setCartItems([...cartItems, { id: productId, quantity: 1 }]);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.code === 'ECONNREFUSED' || !error.response) {
        alert('Cannot connect to server. Please check if the backend is running.');
      } else if (error.response && error.response.status === 401) {
        alert('Authentication failed. Please log in again.');
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    }
  }
  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };
  
  // Function to update quantity of an item in the cart
  const updateCartItemQuantity = (productId, newQuantity) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  return (
    <Router>
      <Routes>
        {/* Auth routes without header/footer */}
        <Route path="/signup" element={
          <div className="auth-page-wrapper">
            <Signup />
          </div>
        } />
        <Route path="/login" element={
          <div className="auth-page-wrapper">
            <Login 
              setToken={token => { 
                setToken(token); 
                localStorage.setItem('token', token);
              }} 
            />
          </div>
        } />
        
        {/* Landing page for unauthenticated users */}
        <Route path="/welcome" element={<LandingPage />} />
        
        {/* Redirect to landing page if accessing the base route without authentication */}
        <Route path="/" element={
          !token ? (
            <Navigate to="/welcome" replace />
          ) : (
            <>
              <Header 
                token={token}
                isHeaderVisible={isHeaderVisible}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                handleLogout={handleLogout}
                cartItems={cartItems}
              />
              <main className="main-content">
                <ProductList addToCart={addToCart} />
              </main>
              <Footer />
            </>
          )
        } />
        
                <Route path="/cart" element={
          !token ? (
            <Navigate to="/welcome" replace />
          ) : (
            <>
              <Header 
                token={token}
                isHeaderVisible={isHeaderVisible}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                handleLogout={handleLogout}
                cartItems={cartItems}
              />
              <main className="main-content">
                <Cart 
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  updateCartItemQuantity={updateCartItemQuantity}
                />
              </main>
              <Footer />
            </>
          )
        } />
        
        <Route path="/profile" element={
          <>
            <Header 
              token={token}
              isHeaderVisible={isHeaderVisible}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleLogout={handleLogout}
              cartItems={cartItems}
            />
            <main className="main-content">
              <ProtectedRoute isAuthenticated={!!token}>
                <div className="profile-page">
                  <h1>My Profile</h1>
                  <p>Profile page content will go here</p>
                </div>
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/orders" element={
          <>
            <Header 
              token={token}
              isHeaderVisible={isHeaderVisible}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleLogout={handleLogout}
              cartItems={cartItems}
            />
            <main className="main-content">
              <ProtectedRoute isAuthenticated={!!token}>
                <div className="orders-page">
                  <h1>My Orders</h1>
                  <p>Order history will go here</p>
                </div>
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
