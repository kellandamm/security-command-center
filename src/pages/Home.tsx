import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  Star,
  ChevronRight,
  Check,
  Eye,
  Lock,
  Activity
} from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Zero Trust Security",
      description: "Advanced security architecture with continuous verification and threat detection",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live threat detection and response with comprehensive audit logging",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data transmission encrypted with industry-standard protocols",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Eye,
      title: "Behavioral Analytics",
      description: "AI-powered user behavior analysis for anomaly detection",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { label: "Security Events Processed", value: "2.4M+", icon: Shield },
    { label: "Threats Prevented", value: "15K+", icon: Lock },
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Uptime", value: "99.9%", icon: TrendingUp }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CISO, TechCorp",
      content: "The zero-trust architecture gives us complete visibility and control over our e-commerce security.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Security Director, RetailPlus",
      content: "Real-time threat detection has prevented multiple security incidents. Highly recommended.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "IT Manager, GlobalShop",
      content: "Seamless integration with existing systems and excellent security monitoring capabilities.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.3),transparent_50%)]"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Zero Trust E-Commerce Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Secure Shopping
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Redefined
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the future of secure e-commerce with our zero-trust architecture, 
                real-time threat detection, and enterprise-grade security monitoring.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Explore Products
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                
                <Link 
                  to="/security-dashboard"
                  className="inline-flex items-center px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Security Dashboard
                  <Eye className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Live Security Status</h3>
                  <div className="flex items-center justify-center text-green-400">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    All Systems Secure
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl transform scale-110"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            >
              Enterprise-Grade Security Features
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Built with security-first principles and zero-trust architecture to protect your business and customers
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  
                  <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    Learn more
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            >
              Trusted by Security Leaders
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              See what industry experts say about our platform
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Ready to Secure Your E-Commerce?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of businesses protecting their customers with our zero-trust security platform
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Shopping Securely
              <ShoppingBag className="w-5 h-5 ml-2" />
            </Link>
            
            <Link 
              to="/security-dashboard"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              View Security Demo
              <Activity className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
