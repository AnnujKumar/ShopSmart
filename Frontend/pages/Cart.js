import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Cart({ token }) {
  const [cart, setCart] = useState({ items: [] })
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    axios.get('/api/cart', { params: { userId }, headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCart(res.data))
  }, [token])
  const removeFromCart = async productId => {
    const userId = localStorage.getItem('userId')
    await axios.post('/api/cart/remove', { userId, productId }, { headers: { Authorization: `Bearer ${token}` } })
    setCart(prev => ({ ...prev, items: prev.items.filter(item => item.product._id !== productId) }))
  }
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart?.items?.map(item => (
          <div key={item.product._id} className="cart-item">
            <span>{item.product.name}</span>
            <span>Qty: {item.quantity}</span>
            <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
