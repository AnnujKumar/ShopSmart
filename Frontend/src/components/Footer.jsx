import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            <li><Link to="/products/category/electronics">Electronics</Link></li>
            <li><Link to="/products/category/clothing">Clothing</Link></li>
            <li><Link to="/products/category/home">Home</Link></li>
            <li><Link to="/products/category/books">Books</Link></li>
            <li><Link to="/products/category/accessories">Accessories</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/shipping">Shipping & Delivery</Link></li>
            <li><Link to="/returns">Returns & Exchanges</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>About Us</h3>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/sustainability">Sustainability</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="social-icon facebook-icon"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="social-icon instagram-icon"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="social-icon twitter-icon"></i>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <i className="social-icon pinterest-icon"></i>
            </a>
          </div>
          
          <div className="newsletter">
            <h4>Subscribe to our newsletter</h4>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">© 2025 E-Commerce Store. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
          <div className="payment-methods">
            <span className="payment-icon visa"></span>
            <span className="payment-icon mastercard"></span>
            <span className="payment-icon amex"></span>
            <span className="payment-icon paypal"></span>
            <span className="payment-icon apple-pay"></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
