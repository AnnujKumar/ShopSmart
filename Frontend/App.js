import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import Cart from './pages/Cart'
import { CartProvider } from './src/context/CartContext'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  return (
    <Router>
      <CartProvider>
        <nav className="navbar">
          <Link to="/">Products</Link>
          <Link to="/cart" id="cartLink">Cart</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={
            <Login setToken={token => { 
              setToken(token); 
              localStorage.setItem('token', token) 
            }} />
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/" element={<ProductList />} />
        </Routes>
      </CartProvider>
    </Router>
  )
}
