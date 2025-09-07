import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ProductList({ addToCart }) {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ price: '', category: '' })
  useEffect(() => {
    axios.get('/api/products', { params: filters }).then(res => setProducts(res.data))
  }, [filters])
  const handleChange = e => setFilters({ ...filters, [e.target.name]: e.target.value })
  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="filters">
        <input name="price" placeholder="Max Price" value={filters.price} onChange={handleChange} />
        <input name="category" placeholder="Category" value={filters.category} onChange={handleChange} />
      </div>
      <div className="products">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => addToCart(product._id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}
