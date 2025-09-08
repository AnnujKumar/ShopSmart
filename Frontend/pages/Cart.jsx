import { Link } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';
import { useEffect } from 'react';

export default function Cart() {
  // Get cart state and methods from context
  const { 
    cart, 
    isLoading, 
    error, 
    totalPrice, 
    removeFromCart, 
    updateQuantity,
    refreshCart
  } = useCart();

  // Refresh cart data when component mounts
  useEffect(() => {
    refreshCart();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <div className="cart-loading">Loading your cart...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <div className="cart-error">
          {error}
          <button 
            onClick={refreshCart} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Render empty cart state
  if (!cart || cart.length === 0) {
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

  // Calculate shipping and total
  const shipping = 5.99;
  const orderTotal = totalPrice + shipping;
  
  // Render cart with items
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      
      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header">
            <div className="cart-header-product">Product</div>
            <div className="cart-header-price">Price</div>
            <div className="cart-header-quantity">Quantity</div>
            <div className="cart-header-total">Total</div>
            <div className="cart-header-actions"></div>
          </div>
          
          {cart.map(item => (
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
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  className="quantity-btn quantity-increase"
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              
              <div className="cart-item-total">
                ${(item.product.price * item.quantity).toFixed(2)}
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
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
          
          <button className="checkout-btn">Proceed to Checkout</button>
          
          <Link to="/" className="continue-shopping-link">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
