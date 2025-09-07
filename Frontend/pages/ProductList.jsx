import { useState, useEffect } from 'react'
import apiClient from '../src/api/axios.js'
import '../src/components/ProductSearch.css'

// Available categories
const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Accessories'];

export default function ProductList({ addToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [maxPrice, setMaxPrice] = useState(200)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [addedToCart, setAddedToCart] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      if (isSearching) {
        setLoading(true);
      }
      setError(null);
      
      try {
        // Construct query params based on filters
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        params.append('maxPrice', maxPrice);
        if (searchTerm.trim() !== '') {
          params.append('search', searchTerm);
        }
        
        const queryString = params.toString();
        console.log('Fetching products with query:', queryString);
        
        const response = await apiClient.get(`/products?${queryString}`);
        console.log('Products response:', response.data.length, 'items found');
        
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please refresh the page.");
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };
    
    // Use a debounce for search
    const timerId = setTimeout(() => {
      fetchProducts();
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [selectedCategory, maxPrice, searchTerm]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Force a search with current term
    setIsSearching(true);
    console.log('Search submitted for:', searchTerm);
  };

  const handleAddToCart = (productId) => {
    addToCart(productId);
    // Show "Added" feedback
    setAddedToCart(prev => ({ ...prev, [productId]: true }));
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  return (
    <div className="product-page-container">
      {/* Left sidebar with filters - 30% width */}
      <div className="sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="category-list">
            {CATEGORIES.map(category => (
              <li 
                key={category} 
                className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Price Range</h3>
          <div className="price-filter">
            <div className="price-range-display">
              <span>$0</span>
              <span className="max-price">${maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="200" 
              step="10"
              value={maxPrice}
              onChange={handlePriceChange}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>$0</span>
              <span>$200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - 70% width */}
      <div className="main-content-area">
        <div className="products-header">
          <h2>Products</h2>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </form>
          <div className="product-count">{filteredProducts.length} results</div>
        </div>

        {isSearching && (
          <div className="searching-indicator">
            <p>Searching products...</p>
          </div>
        )}

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
              <div className="product-details">
                <div>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                </div>
                <div>
                  <div className="product-price">${product.price.toFixed(2)}</div>
                  <button 
                    className={`add-to-cart-button ${addedToCart[product._id] ? 'added' : ''}`}
                    onClick={() => handleAddToCart(product._id)}
                  >
                    {addedToCart[product._id] ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && !isSearching && (
          <div className="no-products-message">
            <p>No products found matching your filters.</p>
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <p>Loading products...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
