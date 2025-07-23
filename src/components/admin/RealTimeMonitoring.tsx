import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  TrendingUp,
  TrendingDown,
  Zap,
  Eye,
  Clock,
  MapPin,
  User,
  CreditCard,
  Lock
} from 'lucide-react'

interface SecurityEvent {
  id: string
  type: 'fraud' | 'attack' | 'breach' | 'anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  location?: string
  user?: string
  action: string
  status: 'active' | 'investigating' | 'blocked' | 'resolved'
}

interface SecurityMetric {
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<any>
  color: string
}

interface RealTimeMonitoringProps {
  simulationActive: boolean
  currentSimulation?: any
}

const RealTimeMonitoring: React.FC<RealTimeMonitoringProps> = ({ 
  simulationActive, 
  currentSimulation 
}) => {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    {
      name: 'Threats Blocked',
      value: 127,
      change: 15,
      trend: 'up',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      name: 'Active Investigations',
      value: 3,
      change: 2,
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      name: 'Risk Score',
      value: 23,
      change: -8,
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      name: 'Response Time',
      value: 1.2,
      change: -0.3,
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600'
    }
  ])

  // Simulate real-time events when simulation is active
  useEffect(() => {
    if (!simulationActive) return

    const interval = setInterval(() => {
      generateSimulatedEvent()
    }, 2000 + Math.random() * 3000) // Random interval between 2-5 seconds

    return () => clearInterval(interval)
  }, [simulationActive, currentSimulation])

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateMetrics()
    }, 5000)

    return () => clearInterval(interval)
  }, [simulationActive])

  const generateSimulatedEvent = () => {
    const eventTypes = ['fraud', 'attack', 'breach', 'anomaly'] as const
    const severities = ['low', 'medium', 'high', 'critical'] as const
    const locations = ['New York, NY', 'London, UK', 'Tokyo, JP', 'São Paulo, BR', 'Mumbai, IN']
    const users = ['user_12345', 'guest_67890', 'admin_99999', 'customer_54321']

    const eventTemplates = {
      fraud: [
        'Suspicious payment pattern detected',
        'Multiple failed payment attempts',
        'Unusual purchase behavior identified',
        'Credit card fraud indicators found'
      ],
      attack: [
        'Brute force login attempt detected',
        'SQL injection attempt blocked',
        'Bot scraping activity identified',
        'API rate limit exceeded'
      ],
      breach: [
        'Unauthorized data access attempt',
        'Privilege escalation detected',
        'Sensitive data exposure risk',
        'Account takeover attempt'
      ],
      anomaly: [
        'Unusual traffic pattern detected',
        'Geographic anomaly identified',
        'Time-based access anomaly',
        'Device fingerprint mismatch'
      ]
    }

    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const severity = simulationActive ? 
      (Math.random() > 0.5 ? 'high' : 'critical') : 
      severities[Math.floor(Math.random() * severities.length)]
    
    const templates = eventTemplates[type]
    const title = templates[Math.floor(Math.random() * templates.length)]

    const newEvent: SecurityEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      title,
      description: `${title} - Automated detection by Zero-Trust agents`,
      timestamp: new Date().toISOString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      user: users[Math.floor(Math.random() * users.length)],
      action: simulationActive ? 'Blocked automatically' : 'Under investigation',
      status: simulationActive ? 'blocked' : 'investigating'
    }

    setEvents(prev => [newEvent, ...prev.slice(0, 9)]) // Keep last 10 events
  }

  const updateMetrics = () => {
    setMetrics(prev => prev.map(metric => {
      let change = 0
      let newValue = metric.value

      if (simulationActive) {
        // Increase threat-related metrics during simulation
        if (metric.name === 'Threats Blocked') {
          change = Math.floor(Math.random() * 10) + 5
          newValue += change
        } else if (metric.name === 'Active Investigations') {
          change = Math.floor(Math.random() * 3) + 1
          newValue += change
        } else if (metric.name === 'Risk Score') {
          change = Math.floor(Math.random() * 15) + 10
          newValue += change
        } else if (metric.name === 'Response Time') {
          change = -(Math.random() * 0.5 + 0.1)
          newValue += change
        }
      } else {
        // Normal fluctuations
        change = (Math.random() - 0.5) * 10
        newValue += change
      }

      return {
        ...metric,
        value: Math.max(0, Number(newValue.toFixed(1))),
        change: Number(change.toFixed(1)),
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      }
    }))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-green-200 bg-green-50 text-green-800'
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'high': return 'border-orange-200 bg-orange-50 text-orange-800'
      case 'critical': return 'border-red-200 bg-red-50 text-red-800'
      default: return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100'
      case 'investigating': return 'text-yellow-600 bg-yellow-100'
      case 'blocked': return 'text-orange-600 bg-orange-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud': return CreditCard
      case 'attack': return Zap
      case 'breach': return Lock
      case 'anomaly': return AlertTriangle
      default: return Activity
    }
  }

  return (
    <div className="space-y-6">
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${metric.color.includes('green') ? 'bg-green-100' :
                metric.color.includes('blue') ? 'bg-blue-100' :
                metric.color.includes('yellow') ? 'bg-yellow-100' : 'bg-purple-100'}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className="flex items-center space-x-1">
                {metric.trend === 'up' ? 
                  <TrendingUp className="w-4 h-4 text-green-600" /> :
                  metric.trend === 'down' ?
                  <TrendingDown className="w-4 h-4 text-red-600" /> :
                  <Activity className="w-4 h-4 text-gray-600" />
                }
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900">
                {metric.name === 'Response Time' ? `${metric.value}s` : metric.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Real-time Events */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Real-time Security Events</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${simulationActive ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium text-gray-600">
              {simulationActive ? 'Simulation Active' : 'Live Monitoring'}
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent security events</p>
                {!simulationActive && (
                  <p className="text-sm mt-1">Start a simulation to see events in real-time</p>
                )}
              </div>
            ) : (
              events.map((event, index) => {
                const TypeIcon = getTypeIcon(event.type)
                return (
                  <motion.div
                    key={event.id}
                    className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(event.severity)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <TypeIcon className="w-5 h-5 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm opacity-80 mt-1">{event.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs opacity-70">
                            {event.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.user && (
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{event.user}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default RealTimeMonitoring
