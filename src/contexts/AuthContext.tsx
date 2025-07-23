import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import apiService, { User } from '../services/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { email: string; password: string; full_name: string }) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already authenticated on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const response = await apiService.getUserProfile()
          if (response.data) {
            setUser(response.data)
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('auth_token')
          }
        } catch (error) {
          localStorage.removeItem('auth_token')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await apiService.login(email, password)
      
      if (response.data) {
        apiService.setToken(response.data.access_token)
        setUser(response.data.user)
        setIsAuthenticated(true)
        toast.success('Login successful!')
        return true
      } else {
        toast.error(response.error || 'Login failed')
        return false
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: { email: string; password: string; full_name: string }): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await apiService.register(userData)
      
      if (response.data) {
        toast.success('Registration successful! Please log in.')
        return true
      } else {
        toast.error(response.error || 'Registration failed')
        return false
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    apiService.logout()
    setIsAuthenticated(false)
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
