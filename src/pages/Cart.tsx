import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  Loader2
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export default function Cart() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, clearCart, total, loading } = useCart()
  const [processingItems, setProcessingItems] = useState<Set<number>>(new Set())

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
      return
    }

    try {
      setProcessingItems(prev => new Set(prev).add(productId))
      await updateQuantity(productId, newQuantity)
    } catch (err) {
      console.error('Failed to update quantity:', err)
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      setProcessingItems(prev => new Set(prev).add(productId))
      await removeItem(productId)
    } catch (err) {
      console.error('Failed to remove item:', err)
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
    } catch (err) {
      console.error('Failed to clear cart:', err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          
          {items.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link 
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-lg p-6 relative"
                >
                  {processingItems.has(item.product_id) && (
                    <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center z-10">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.product?.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingCart className="w-8 h-8 text-blue-500" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.product?.name || `Product #${item.product_id}`}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {item.product?.description || 'Product description not available'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${item.product?.price || 0}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                        disabled={processingItems.has(item.product_id)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                        disabled={processingItems.has(item.product_id)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={processingItems.has(item.product_id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 sticky top-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-blue-600">${(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </button>

                <Link 
                  to="/products"
                  className="w-full mt-4 flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
