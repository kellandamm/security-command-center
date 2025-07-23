import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import apiService, { CartItem as ApiCartItem, Product } from '../services/api'
import toast from 'react-hot-toast'

interface CartItem extends ApiCartItem {
  product?: Product
}

interface CartContextType {
  items: CartItem[]
  addItem: (productId: number, quantity: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  loading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Load cart items on mount
  useEffect(() => {
    refreshCart()
  }, [])

  const refreshCart = async () => {
    try {
      setLoading(true)
      const response = await apiService.getCart()
      if (response.data) {
        // Fetch product details for each cart item
        const itemsWithProducts = await Promise.all(
          response.data.map(async (item) => {
            const productResponse = await apiService.getProduct(item.product_id.toString())
            return {
              ...item,
              product: productResponse.data
            }
          })
        )
        setItems(itemsWithProducts)
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (productId: number, quantity: number) => {
    try {
      setLoading(true)
      const response = await apiService.addToCart(productId, quantity)
      if (response.data) {
        await refreshCart()
        toast.success('Item added to cart!')
      } else {
        toast.error(response.error || 'Failed to add item to cart')
      }
    } catch (error) {
      toast.error('Failed to add item to cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setLoading(true)
      const response = await apiService.updateCartItem(productId, quantity)
      if (response.data) {
        await refreshCart()
        toast.success('Cart updated!')
      } else {
        toast.error(response.error || 'Failed to update cart')
      }
    } catch (error) {
      toast.error('Failed to update cart')
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (productId: number) => {
    try {
      setLoading(true)
      const response = await apiService.removeFromCart(productId)
      if (response.error) {
        toast.error(response.error)
      } else {
        await refreshCart()
        toast.success('Item removed from cart!')
      }
    } catch (error) {
      toast.error('Failed to remove item from cart')
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      const response = await apiService.clearCart()
      if (response.error) {
        toast.error(response.error)
      } else {
        setItems([])
        toast.success('Cart cleared!')
      }
    } catch (error) {
      toast.error('Failed to clear cart')
    } finally {
      setLoading(false)
    }
  }

  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      updateQuantity, 
      removeItem, 
      clearCart, 
      total, 
      loading,
      refreshCart 
    }}>
      {children}
    </CartContext.Provider>
  )
}
