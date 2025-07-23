import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, EyeOff } from 'lucide-react'

interface SecurityLoginProps {
  onAuthenticated: () => void
}

const SecurityLogin: React.FC<SecurityLoginProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Demo password - in production this would be handled by Azure AD B2C or similar
  const SECURITY_PASSWORD = 'ZeroTrust2024!'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (password === SECURITY_PASSWORD) {
      // Store authentication in session storage (expires when browser closes)
      sessionStorage.setItem('security-authenticated', 'true')
      sessionStorage.setItem('security-auth-time', new Date().toISOString())
      onAuthenticated()
    } else {
      setError('Invalid password. Please contact your security administrator.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Security Command Center</h1>
          <p className="text-blue-200 text-sm">
            This area contains sensitive security information.<br />
            Authentication required to proceed.
          </p>
        </motion.div>

        {/* Authentication Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter security password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-red-200 text-sm flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                {error}
              </p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Access Security Center
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Demo Information */}
        <motion.div
          className="mt-8 pt-6 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-blue-500/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-200 mb-2">Demo Information</h3>
            <p className="text-xs text-blue-300 mb-2">
              For demonstration purposes, the password is: <code className="bg-white/10 px-1 rounded">ZeroTrust2024!</code>
            </p>
            <p className="text-xs text-blue-300">
              In production, this would integrate with Azure AD B2C, Azure AD, or your enterprise identity provider.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SecurityLogin
