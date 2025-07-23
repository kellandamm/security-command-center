import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Shield, 
  Lock, 
  CheckCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setProcessing(true)
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      await clearCart()
      setOrderComplete(true)
      toast.success('Order placed successfully!')
    } catch (err) {
      console.error('Checkout failed:', err)
      toast.error('Failed to process order. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed and will be processed shortly.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some products to your cart before checking out.</p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/cart')}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <div className="flex items-center text-green-600">
            <Shield className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">256-bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div></div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="nameOnCard"
                    placeholder="Name on card"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            </form>
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
                {items.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-600">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product?.name || `Product #${item.product_id}`}</p>
                      <p className="text-gray-600 text-sm">${item.product?.price || 0}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 mb-4" />
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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
                type="submit"
                form="checkout-form"
                onClick={handleSubmit}
                disabled={processing}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <CreditCard className="w-5 h-5 mr-2" />
                )}
                {processing ? 'Processing...' : 'Complete Order'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
