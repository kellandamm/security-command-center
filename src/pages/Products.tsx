import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Grid, 
  Shield,
  Zap,
  Users,
  TrendingUp,
  Award,
  Loader2
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import apiService, { Product } from '../services/api'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('name')
  
  const { addItem } = useCart()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getProducts()
      if (response.data) {
        setProducts(response.data)
      } else if (response.error) {
        setError(response.error)
      }
    } catch (err) {
      console.error('Failed to load products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id, 1)
    } catch (err) {
      console.error('Failed to add to cart:', err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading products...</p>
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
            onClick={loadProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const categories = [
    { id: 'all', name: 'All Products', icon: Grid },
    { id: 'servers', name: 'Servers', icon: Shield },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'storage', name: 'Storage', icon: Zap },
    { id: 'identity', name: 'Identity', icon: Users },
    { id: 'networking', name: 'Networking', icon: TrendingUp },
    { id: 'analytics', name: 'Analytics', icon: Award }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
    >
      <div className="relative">
        <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-48 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
              <Shield className="w-16 h-16 text-blue-500" />
            </div>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
          <Link 
            to={`/products/${product.id}`}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {categories.find(cat => cat.id === product.category)?.name || 'Product'}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
              Enterprise Security
            </span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
              Zero Trust
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
          </div>
          
          <button 
            onClick={() => handleAddToCart(product)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
          >
            Security Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            Discover our comprehensive range of zero-trust security solutions designed to protect your digital infrastructure
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            )
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setPriceRange([0, 1000])
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
