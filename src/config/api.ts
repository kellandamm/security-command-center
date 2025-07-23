// API Configuration for the E-commerce application

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string): string => {
  return (globalThis as any).VITE_ENV?.[key] || fallback
}

export const API_CONFIG = {
  // Use environment variables if available, otherwise fallback to production URLs
  BASE_URL: getEnvVar('VITE_API_URL', 'https://ecom-backend-wo2w5qss.agreeablesmoke-17bdb440.eastus2.azurecontainerapps.io'),
  WS_URL: getEnvVar('VITE_WS_URL', 'wss://ecom-backend-wo2w5qss.agreeablesmoke-17bdb440.eastus2.azurecontainerapps.io'),
  
  // API Endpoints
  endpoints: {
    // Authentication
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      refresh: '/auth/refresh',
      logout: '/auth/logout',
    },
    
    // Products
    products: {
      list: '/products',
      detail: (id: string) => `/products/${id}`,
      search: '/products/search',
    },
    
    // Cart & Orders
    cart: {
      get: '/cart',
      add: '/cart/add',
      update: '/cart/update',
      remove: '/cart/remove',
      clear: '/cart/clear',
    },
    
    orders: {
      create: '/orders',
      list: '/orders',
      detail: (id: string) => `/orders/${id}`,
    },
    
    // User Account
    user: {
      profile: '/user/profile',
      update: '/user/profile',
      orders: '/user/orders',
    },
    
    // Zero-Trust Security
    security: {
      status: '/api/zerotrust/security-summary',
      events: '/api/zerotrust/security-events',
      compliance: '/api/zerotrust/compliance-status',
      analyze: '/api/zerotrust/analyze-session',
    },
    
    // System
    health: '/health',
  },
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to build WebSocket URLs
export const buildWsUrl = (endpoint: string): string => {
  return `${API_CONFIG.WS_URL}${endpoint}`
}

export default API_CONFIG
