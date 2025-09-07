import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import Cart from './pages/Cart'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [cartItems, setCartItems] = useState([])
  const addToCart = async productId => {
    const userId = localStorage.getItem('userId')
    await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, productId, quantity: 1 })
    })
    setCartItems([...cartItems, productId])
  }
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={token => { setToken(token); localStorage.setItem('token', token) }} />} />
        <Route path="/cart" element={<Cart token={token} />} />
        <Route path="/" element={<ProductList addToCart={addToCart} />} />
      </Routes>
    </Router>
  )
}
