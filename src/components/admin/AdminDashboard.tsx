import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Settings, 
  Monitor, 
  AlertTriangle,
  BarChart3,
  Users,
  Lock,
  Zap,
  Eye
} from 'lucide-react'
import SimulationControls from './SimulationControls'
import RealTimeMonitoring from './RealTimeMonitoring'
import NetworkTopology from './NetworkTopology'
import GuidedDemoTour from './GuidedDemoTour'

interface AttackSimulation {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  severity: 'low' | 'medium' | 'high' | 'critical'
  endpoint: string
  payload: any
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulations' | 'monitoring' | 'network' | 'analytics' | 'settings'>('overview')
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [currentSimulation, setCurrentSimulation] = useState<AttackSimulation | null>(null)
  const [showDemoTour, setShowDemoTour] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState({
    threats_blocked: 127,
    active_sessions: 1248,
    security_score: 96,
    uptime: '99.8%'
  })

  // Real-time metrics update when simulation is running
  useEffect(() => {
    if (simulationRunning) {
      const interval = setInterval(() => {
        setSystemMetrics(prev => ({
          threats_blocked: prev.threats_blocked + Math.floor(Math.random() * 5),
          active_sessions: prev.active_sessions + Math.floor(Math.random() * 20) - 10,
          security_score: Math.max(75, Math.min(100, prev.security_score + (Math.random() - 0.5) * 4)),
          uptime: prev.uptime
        }))
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [simulationRunning])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Monitor },
    { id: 'simulations', label: 'Attack Simulations', icon: Zap },
    { id: 'monitoring', label: 'Real-time Monitoring', icon: Eye },
    { id: 'network', label: 'Network Topology', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Admin Settings', icon: Settings }
  ]

  const handleSimulationStart = (simulation: AttackSimulation) => {
    setCurrentSimulation(simulation)
    setSimulationRunning(true)
    
    // Simulate API call to backend
    console.log('Starting simulation:', simulation)
    
    // In real implementation, make API call to backend:
    // fetch(`${API_BASE_URL}${simulation.endpoint}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(simulation.payload)
    // })
  }

  const handleSimulationStop = () => {
    setSimulationRunning(false)
    setCurrentSimulation(null)
    
    // Simulate API call to stop simulation
    console.log('Stopping simulation')
  }

  const overviewStats = [
    {
      name: 'Active Agents',
      value: '5',
      description: 'Zero-Trust security agents monitoring',
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Threats Blocked',
      value: systemMetrics.threats_blocked.toString(),
      description: 'Threats prevented in last 24h',
      icon: Shield,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Risk Level',
      value: simulationRunning ? 'High' : 'Low',
      description: 'Current system risk assessment',
      icon: AlertTriangle,
      color: simulationRunning ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
    },
    {
      name: 'Compliance Score',
      value: '91%',
      description: 'Security compliance rating',
      icon: Lock,
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between" id="dashboard-header">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Security Admin Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Advanced Zero-Trust security monitoring and attack simulation control center
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDemoTour(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Demo Tour</span>
              </button>
              
              {/* Status Indicator */}
              <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
                simulationRunning ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  simulationRunning ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                }`}></div>
                <span className="font-medium">
                  {simulationRunning ? 'Simulation Active' : 'System Secure'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, index) => (
                  <motion.div
                    key={stat.name}
                    className="bg-white rounded-lg shadow-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('simulations')}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Zap className="w-6 h-6 text-red-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Run Attack Simulation</p>
                      <p className="text-sm text-gray-600">Test security responses</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('monitoring')}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Monitor className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">View Monitoring</p>
                      <p className="text-sm text-gray-600">Real-time security events</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Security Analytics</p>
                      <p className="text-sm text-gray-600">Performance insights</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity Preview */}
              <RealTimeMonitoring 
                simulationActive={simulationRunning} 
                currentSimulation={currentSimulation || undefined} 
              />
            </div>
          )}
          
          {activeTab === 'simulations' && (
            <SimulationControls
              onSimulationStart={handleSimulationStart}
              onSimulationStop={handleSimulationStop}
              isRunning={simulationRunning}
              currentSimulation={currentSimulation || undefined}
            />
          )}
          
          {activeTab === 'monitoring' && (
            <RealTimeMonitoring 
              simulationActive={simulationRunning} 
              currentSimulation={currentSimulation || undefined} 
            />
          )}

          {activeTab === 'network' && (
            <NetworkTopology 
              simulationRunning={simulationRunning}
              currentSimulation={currentSimulation || undefined}
            />
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Threat Trends */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Threat Detection Trends</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Fraud Attempts</span>
                      <span className="font-semibold text-red-600">+23%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Bot Activity</span>
                      <span className="font-semibold text-yellow-600">+12%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Account Takeovers</span>
                      <span className="font-semibold text-green-600">-8%</span>
                    </div>
                  </div>
                </div>

                {/* Response Performance */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Response Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Avg Response Time</span>
                      <span className="font-semibold text-blue-600">1.2s</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-semibold text-green-600">99.7%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">False Positives</span>
                      <span className="font-semibold text-orange-600">2.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Admin Settings</h2>
              
              <div className="space-y-8">
                {/* Simulation Settings */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Simulation Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Simulation Intensity
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Low</option>
                        <option selected>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auto-stop Timeout (minutes)
                      </label>
                      <input 
                        type="number" 
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Monitoring Settings */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monitoring Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Real-time Alerts</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Event Logging</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Guided Demo Tour */}
      <GuidedDemoTour
        isOpen={showDemoTour}
        onClose={() => setShowDemoTour(false)}
        onStartSimulation={() => {
          setActiveTab('simulations')
          setShowDemoTour(false)
        }}
      />
    </div>
  )
}

export default AdminDashboard
