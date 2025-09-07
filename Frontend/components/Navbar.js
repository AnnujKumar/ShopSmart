import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Products</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Login</Link>
    </nav>
  )
}
