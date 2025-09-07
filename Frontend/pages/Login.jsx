import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import apiClient from '../src/api/axios.js'
import '../src/auth.css'

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get the intended destination from location state (passed by ProtectedRoute)
  const from = location.state?.from?.pathname || '/'
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  
  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setMessageType('')
    
    try {
      const res = await apiClient.post('/users/login', form)
      
      if (res.data.token) {
        localStorage.setItem('userId', res.data.userId || res.data.user?._id);
        setToken(res.data.token)
        setMessage('Login successful! Redirecting...')
        setMessageType('success')
        
        // Redirect to the intended page after successful login
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 1500)
      } else {
        setMessage('Login failed: Invalid response from server')
        setMessageType('error')
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessageType('error')
      
      if (err.code === 'ERR_NETWORK') {
        setMessage('Cannot connect to server. Please check if the backend is running.');
      } else if (err.response) {
        setMessage(`Login failed: ${err.response.data.error || 'Invalid credentials'}`);
      } else {
        setMessage('Login failed: An unexpected error occurred');
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
        <h2>Welcome Back</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
              autoFocus
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
              placeholder="Enter your password" 
              value={form.password} 
              onChange={handleChange} 
              required 
            />
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : 'Log In'}
          </button>
        </form>
        
        {message && (
          <div className={`auth-message ${messageType}`}>
            {message}
          </div>
        )}
        
        <div className="auth-switch">
          Don't have an account?<Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
