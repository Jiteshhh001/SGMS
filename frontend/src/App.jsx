import { useState, useEffect } from 'react'
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState('login')
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setIsAuthenticated(true)
      setToken(storedToken)
      setCurrentView('dashboard')
    }
  }, [])

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token)
    setToken(token)
    setIsAuthenticated(true)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setIsAuthenticated(false)
    setCurrentView('login')
  }

  const handleRegisterSuccess = () => {
    setCurrentView('login')
  }

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <div className="auth-container">
          {currentView === 'login' ? (
            <>
              <Login onLoginSuccess={handleLoginSuccess} />
              <p className="toggle-auth">
                Don't have an account?{' '}
                <button onClick={() => setCurrentView('register')} className="link-btn">
                  Register here
                </button>
              </p>
            </>
          ) : (
            <>
              <Register onRegisterSuccess={handleRegisterSuccess} />
              <p className="toggle-auth">
                Already have an account?{' '}
                <button onClick={() => setCurrentView('login')} className="link-btn">
                  Login here
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <Dashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
