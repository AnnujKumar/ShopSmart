import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../src/api/axios.js'
import '../src/auth.css'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const navigate = useNavigate()
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  
  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setMessageType('')
    
    try {
      await apiClient.post('/users/signup', form)
      setForm({ name: '', email: '', password: '', address: '' }) // Clear form on success
      setMessage('Signup successful! You can now log in.')
      setMessageType('success')
      
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      console.error('Signup error:', err);
      setMessageType('error')
      
      if (err.code === 'ERR_NETWORK') {
        setMessage('Cannot connect to server. Please check if the backend is running.');
      } else if (err.response) {
        setMessage(`Signup failed: ${err.response.data.error || 'This email may already be registered'}`);
      } else {
        setMessage('Signup failed: An unexpected error occurred');
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <Link to="/">ShopSmart</Link>
        </div>
        <h2>Create Account</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
              </svg>
              Full Name
            </label>
            <input 
              id="name"
              name="name" 
              className="auth-input"
              placeholder="Enter your full name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
              </svg>
              Email Address
            </label>
            <input 
              id="email"
              name="email" 
              type="email" 
              className="auth-input"
              placeholder="Enter your email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              Password
            </label>
            <input 
              id="password"
              name="password" 
              type="password" 
              className="auth-input"
              placeholder="Create a secure password" 
              value={form.password} 
              onChange={handleChange} 
              required 
            />
            <div className="password-strength">
              <div className={`password-strength-bar ${form.password.length > 8 ? 'strong' : form.password.length > 5 ? 'medium' : form.password.length > 0 ? 'weak' : ''}`}></div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
              Shipping Address
            </label>
            <input 
              id="address"
              name="address" 
              className="auth-input"
              placeholder="Enter your shipping address" 
              value={form.address} 
              onChange={handleChange}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : 'Sign Up'}
          </button>
        </form>
        
        {message && (
          <div className={`auth-message ${messageType}`}>
            {message}
          </div>
        )}
        
        <div className="auth-switch">
          Already have an account?<Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
