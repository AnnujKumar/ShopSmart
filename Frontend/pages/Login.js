import { useState } from 'react'
import axios from 'axios'

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/users/login', form)
      setToken(res.data.token)
      setMessage('Login successful!')
    } catch (err) {
      setMessage('Login failed')
    }
  }
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <div>{message}</div>
    </div>
  )
}
