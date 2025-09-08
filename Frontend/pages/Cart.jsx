import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../src/api/axios.js';

export default function Cart({ token, onRemoveItem, onUpdateQuantity, initialCartItems = [] }) {
  const [cart, setCart] = useState({ items: initialCartItems || [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  // Calculate the total price of all items in the cart
  const totalPrice = cart?.items?.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  useEffect(() => {
    // First, initialize with any initial cart items passed from parent
    if (initialCartItems && initialCartItems.length > 0) {
      setCart({ items: initialCartItems });
      
      // Initialize quantities state with current item quantities
      const initialQuantities = {};
      initialCartItems.forEach(item => {
        if (item.product && item.product._id) {
          initialQuantities[item.product._id] = item.quantity;
        }
      });
      setQuantities(initialQuantities);
      setIsLoading(false);
      return;
    }
    
    // If no initial items, fetch from the backend
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching cart data from API...');
        const response = await apiClient.get('/cart');
        
        // Check if response has expected data structure
        if (response.data) {
          console.log('Cart data received:', response.data);
          setCart(response.data || { items: [] });
          
          // Initialize quantities state with current item quantities
          const initialQuantities = {};
          if (response.data.items && Array.isArray(response.data.items)) {
            response.data.items.forEach(item => {
              if (item.product && item.product._id) {
                initialQuantities[item.product._id] = item.quantity;
              }
            });
          }
          setQuantities(initialQuantities);
          setError(null);
        } else {
          setCart({ items: [] });
          setQuantities({});
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        // Check if it's a connection error
        if (err.code === 'ECONNREFUSED' || !err.response) {
          setError('Cannot connect to server. Please check if the backend is running.');
        } else if (err.response && err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError('Failed to load cart. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchCart();
    } else {
      setIsLoading(false);
    }
  }, [token, initialCartItems]);

  const removeFromCart = async (productId) => {
    try {
      // No need to pass userId, will be extracted from token
      await apiClient.post('/cart/remove', { productId });
      
      // Update local cart state
      setCart(prev => ({ 
        ...prev, 
        items: prev.items.filter(item => item.product._id !== productId) 
      }));
      
      // Update parent component's cart state (for header cart count)
      if (onRemoveItem) {
        onRemoveItem(productId);
      }
    } catch (err) {
      setError('Failed to remove item. Please try again.');
      console.error('Error removing item from cart:', err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      // No need to pass userId, will be extracted from token
      await apiClient.post('/cart/update', { productId, quantity: newQuantity });
      
      // Update local state
      setQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
      
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.product._id === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      }));
      
      // Update parent component's cart state (for header cart count)
      if (onUpdateQuantity) {
        onUpdateQuantity(productId, newQuantity);
      }
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
      console.error('Error updating quantity:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <div className="cart-loading">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <div className="cart-error">{error}</div>
      </div>
    );
  }

  if (cart?.items?.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </div>
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      
      {error && <div className="cart-error">{error}</div>}
      
      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header">
            <div className="cart-header-product">Product</div>
            <div className="cart-header-price">Price</div>
            <div className="cart-header-quantity">Quantity</div>
            <div className="cart-header-total">Total</div>
            <div className="cart-header-actions"></div>
          </div>
          
          {cart?.items?.map(item => (
            <div key={item.product._id} className="cart-item">
              <div className="cart-item-product">
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.product.name}</h3>
                  <p className="cart-item-category">{item.product.category}</p>
                </div>
              </div>
              
              <div className="cart-item-price">${item.product.price.toFixed(2)}</div>
              
              <div className="cart-item-quantity">
                <button 
                  className="quantity-btn quantity-decrease"
                  onClick={() => updateQuantity(item.product._id, quantities[item.product._id] - 1)}
                  disabled={quantities[item.product._id] <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantities[item.product._id]}</span>
                <button 
                  className="quantity-btn quantity-increase"
                  onClick={() => updateQuantity(item.product._id, quantities[item.product._id] + 1)}
                >
                  +
                </button>
              </div>
              
              <div className="cart-item-total">
                ${(item.product.price * quantities[item.product._id]).toFixed(2)}
              </div>
              
              <div className="cart-item-actions">
                <button 
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.product._id)}
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${totalPrice ? totalPrice.toFixed(2) : '0.00'}</span>
          </div>
          
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>$5.99</span>
          </div>
          
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>${totalPrice ? (totalPrice + 5.99).toFixed(2) : '5.99'}</span>
          </div>
          
          <button className="checkout-btn">Proceed to Checkout</button>
          
          <Link to="/" className="continue-shopping-link">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
