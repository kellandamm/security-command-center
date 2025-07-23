import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SecurityBanner from './components/security/SecurityBanner'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import SecurityDashboard from './pages/ProtectedSecurityDashboard'
import AdminDemo from './pages/AdminDemo'

// Providers
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { SecurityProvider } from './contexts/SecurityContext'

// WebSocket for real-time security updates
import { useWebSocket } from './hooks/useWebSocket'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

function App() {
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([])
  const [systemStatus, setSystemStatus] = useState<'secure' | 'warning' | 'alert'>('secure')

  // WebSocket connection for real-time security updates
  const { socket, isConnected } = useWebSocket('/ws/security')

  useEffect(() => {
    if (socket) {
      socket.on('security_alert', (alert) => {
        setSecurityAlerts(prev => [alert, ...prev.slice(0, 9)]) // Keep last 10 alerts
        setSystemStatus(alert.severity)
      })

      socket.on('system_status', (status) => {
        setSystemStatus(status)
      })

      socket.on('threat_detected', (threat) => {
        setSecurityAlerts(prev => [{
          id: Date.now(),
          type: 'threat',
          message: threat.message,
          severity: threat.severity,
          timestamp: new Date().toISOString()
        }, ...prev.slice(0, 9)])
      })
    }

    return () => {
      if (socket) {
        socket.off('security_alert')
        socket.off('system_status')
        socket.off('threat_detected')
      }
    }
  }, [socket])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <SecurityProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                {/* Security Banner - Shows current security status */}
                <SecurityBanner 
                  status={systemStatus} 
                  isConnected={isConnected}
                  alertCount={securityAlerts.length}
                />
                
                {/* Main Application */}
                <div className="flex flex-col min-h-screen">
                  <Header />
                  
                  {/* Add top padding to account for fixed header */}
                  <main className="flex-1 pt-24 lg:pt-28">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/security-dashboard" element={<SecurityDashboard />} />
                        <Route path="/admin/demo" element={<AdminDemo />} />
                      </Routes>
                    </motion.div>
                  </main>
                  
                  <Footer />
                </div>
                
                {/* Toast Notifications */}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                      borderRadius: '12px',
                      padding: '16px',
                    },
                    success: {
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </SecurityProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
