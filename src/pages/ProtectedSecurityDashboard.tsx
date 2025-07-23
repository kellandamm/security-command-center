import React, { useState, useEffect } from 'react'
import SecurityLogin from '../components/SecurityLogin'
import SecurityDashboard from './SecurityDashboard'

const ProtectedSecurityDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('security-authenticated')
      const authTime = sessionStorage.getItem('security-auth-time')
      
      if (authStatus === 'true' && authTime) {
        // Check if session is still valid (4 hours max)
        const authTimeStamp = new Date(authTime).getTime()
        const currentTime = new Date().getTime()
        const fourHours = 4 * 60 * 60 * 1000 // 4 hours in milliseconds
        
        if (currentTime - authTimeStamp < fourHours) {
          setIsAuthenticated(true)
        } else {
          // Session expired, clear it
          sessionStorage.removeItem('security-authenticated')
          sessionStorage.removeItem('security-auth-time')
        }
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('security-authenticated')
    sessionStorage.removeItem('security-auth-time')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <SecurityLogin onAuthenticated={handleAuthenticated} />
  }

  // Add logout functionality to the authenticated dashboard
  return (
    <div className="relative">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          Logout Security Center
        </button>
      </div>
      
      <SecurityDashboard />
    </div>
  )
}

export default ProtectedSecurityDashboard
