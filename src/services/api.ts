// API Service for handling HTTP requests to the backend
import { API_CONFIG, buildApiUrl } from '../config/api'

// Types
export interface User {
  id: string
  email: string
  full_name: string
  is_admin?: boolean
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  stock_quantity: number
}

export interface CartItem {
  product_id: number
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  items: CartItem[]
  total_amount: number
  status: string
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// API Service Class
class ApiService {
  private token: string | null = null

  constructor() {
    // Load token from localStorage if available
    this.token = localStorage.getItem('auth_token')
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  // Clear authentication token
  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  // Get authorization headers
  private getHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
    })

    if (this.token) {
      headers.append('Authorization', `Bearer ${this.token}`)
    }

    return headers
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = buildApiUrl(endpoint)
      const response = await fetch(url, {
        headers: this.getHeaders(),
        ...options,
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken()
          window.location.href = '/account'
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API request failed:', error)
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_CONFIG.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: { email: string; password: string; full_name: string }): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout(): Promise<void> {
    this.clearToken()
  }

  // Product methods
  async getProducts(params?: { skip?: number; limit?: number; category?: string; search?: string }): Promise<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)

    const endpoint = `${API_CONFIG.endpoints.products.list}?${queryParams.toString()}`
    return this.request<Product[]>(endpoint)
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(API_CONFIG.endpoints.products.detail(id))
  }

  // Cart methods
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    return this.request<CartItem[]>(API_CONFIG.endpoints.cart.get)
  }

  async addToCart(productId: number, quantity: number): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>(API_CONFIG.endpoints.cart.add, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  }

  async updateCartItem(productId: number, quantity: number): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>(API_CONFIG.endpoints.cart.update, {
      method: 'PUT',
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  }

  async removeFromCart(productId: number): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.endpoints.cart.remove, {
      method: 'DELETE',
      body: JSON.stringify({ product_id: productId }),
    })
  }

  async clearCart(): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.endpoints.cart.clear, {
      method: 'DELETE',
    })
  }

  // Order methods
  async createOrder(orderData: { items: CartItem[] }): Promise<ApiResponse<Order>> {
    return this.request<Order>(API_CONFIG.endpoints.orders.create, {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>(API_CONFIG.endpoints.orders.list)
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(API_CONFIG.endpoints.orders.detail(id))
  }

  // User methods
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.endpoints.user.profile)
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.endpoints.user.update, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>(API_CONFIG.endpoints.health)
  }

  // Security methods
  async getSecuritySummary(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`${API_CONFIG.endpoints.security.status}/${userId}`)
  }

  async getSecurityEvents(params?: { user_id?: string; since_hours?: number; event_types?: string }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (params?.user_id) queryParams.append('user_id', params.user_id)
    if (params?.since_hours) queryParams.append('since_hours', params.since_hours.toString())
    if (params?.event_types) queryParams.append('event_types', params.event_types)

    const endpoint = `${API_CONFIG.endpoints.security.events}?${queryParams.toString()}`
    return this.request<any>(endpoint)
  }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService
