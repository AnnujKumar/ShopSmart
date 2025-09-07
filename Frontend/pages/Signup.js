import { useState } from 'react'
import axios from 'axios'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' })
  const [message, setMessage] = useState('')
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post('/api/users/signup', form)
      setMessage('Signup successful!')
    } catch (err) {
      setMessage('Signup failed')
    }
  }
  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
      <div>{message}</div>
    </div>
  )
}
