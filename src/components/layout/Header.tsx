import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Search, 
  Shield, 
  Bell, 
  ChevronDown,
  Activity,
  Settings,
  LogOut,
  Heart,
  Package
} from 'lucide-react'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount] = useState(3) // This would come from cart context
  const [notifications] = useState(2) // This would come from notifications context
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Security', href: '/security-dashboard', icon: Shield },
    { name: 'Account', href: '/account', icon: User },
  ]

  const userMenuItems = [
    { name: 'Profile', href: '/account', icon: User },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Sign Out', href: '/logout', icon: LogOut },
  ]

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white shadow-sm border-b border-gray-100'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  SecureCommerce
                </div>
                <div className="text-xs text-gray-500 -mt-1">Zero Trust Platform</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActiveRoute(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
                {isActiveRoute(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Cart */}
            <Link 
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-semibold text-gray-900">John Doe</div>
                    <div className="text-sm text-gray-500">john@example.com</div>
                  </div>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link 
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 py-4"
          >
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-4 py-2">
                  <div className="font-semibold text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">john@example.com</div>
                </div>
                {userMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Security Status Bar */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-1">
        <div className="container mx-auto px-4 flex items-center justify-center space-x-2 text-sm">
          <Activity className="w-4 h-4" />
          <span>All systems secure • Last threat scan: 2 minutes ago</span>
        </div>
      </div>
    </header>
  )
}

export default Header
