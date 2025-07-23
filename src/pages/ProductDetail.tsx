import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Shield, 
  Check,
  ArrowLeft,
  Loader2,
  Plus,
  Minus
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import apiService, { Product } from '../services/api'
import { toast } from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      loadProduct(id)
    }
  }, [id])

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getProduct(productId)
      if (response.data) {
        setProduct(response.data)
      } else if (response.error) {
        setError(response.error)
      }
    } catch (err) {
      console.error('Failed to load product:', err)
      setError('Failed to load product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addItem(product.id, quantity)
        toast.success(`Added ${quantity} ${product.name} to cart`)
      } catch (err) {
        toast.error('Failed to add to cart')
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-24 h-24 text-blue-500" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.5 (reviews coming soon)</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <p className="text-lg text-gray-600 mb-6">{product.description}</p>

              {/* Security Features - Coming Soon */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Zero Trust Architecture</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                
                <button className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors">
                  <Heart className="w-5 h-5 mr-2" />
                  Wishlist
                </button>
                
                <button className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{product.stock_quantity} units</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
