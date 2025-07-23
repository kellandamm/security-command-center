import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Square, 
  AlertTriangle, 
  Target,
  Zap,
  Bot,
  CreditCard,
  Users,
  Lock,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import SecuritySimulationAPI from '../../services/securitySimulationAPI'
import { soundManager } from '../../services/securitySoundManager'

interface AttackSimulation {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  severity: 'low' | 'medium' | 'high' | 'critical'
  endpoint: string
  payload: any
}

interface SimulationControlsProps {
  onSimulationStart: (simulation: AttackSimulation) => void
  onSimulationStop: () => void
  isRunning: boolean
  currentSimulation?: AttackSimulation
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  onSimulationStart,
  onSimulationStop,
  isRunning,
  currentSimulation
}) => {
  const [selectedSimulation, setSelectedSimulation] = useState<AttackSimulation | null>(null)
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium')

  // Initialize sound effects on component mount
  useEffect(() => {
    soundManager.initializeSounds()
  }, [])

  const attackSimulations: AttackSimulation[] = [
    {
      id: 'credit_card_fraud',
      name: 'Credit Card Fraud',
      description: 'Simulate suspicious payment transactions with unusual patterns',
      icon: CreditCard,
      severity: 'high',
      endpoint: '/demo/simulate-fraud',
      payload: { attack_type: 'credit_card_fraud', intensity: 'high' }
    },
    {
      id: 'account_takeover',
      name: 'Account Takeover',
      description: 'Simulate credential stuffing and brute force login attempts',
      icon: Users,
      severity: 'critical',
      endpoint: '/demo/simulate-takeover',
      payload: { attack_type: 'credential_stuffing', target_accounts: 100 }
    },
    {
      id: 'bot_attack',
      name: 'Bot Scraping Attack',
      description: 'Simulate automated scraping and content harvesting bots',
      icon: Bot,
      severity: 'medium',
      endpoint: '/demo/simulate-bot',
      payload: { attack_type: 'scraping', requests_per_second: 1000 }
    },
    {
      id: 'api_abuse',
      name: 'API Rate Limit Abuse',
      description: 'Simulate API flooding and rate limit bypass attempts',
      icon: Zap,
      severity: 'high',
      endpoint: '/demo/simulate-api-abuse',
      payload: { attack_type: 'rate_limit_bypass', requests_per_minute: 5000 }
    },
    {
      id: 'data_exfiltration',
      name: 'Data Exfiltration',
      description: 'Simulate unauthorized access to sensitive customer data',
      icon: Lock,
      severity: 'critical',
      endpoint: '/demo/simulate-data-breach',
      payload: { attack_type: 'data_exfiltration', data_type: 'customer_pii' }
    },
    {
      id: 'ddos_attack',
      name: 'DDoS Simulation',
      description: 'Simulate distributed denial of service attack patterns',
      icon: Target,
      severity: 'critical',
      endpoint: '/demo/simulate-ddos',
      payload: { attack_type: 'volumetric_ddos', intensity: 'high' }
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleStartSimulation = async () => {
    if (!selectedSimulation) {
      toast.error('Please select an attack simulation first')
      return
    }

    const payload = {
      attack_type: selectedSimulation.payload.attack_type,
      intensity,
      timestamp: new Date().toISOString(),
      admin_initiated: true,
      ...selectedSimulation.payload
    }

    try {
      toast.loading('Starting simulation...', { id: 'simulation-start' })
      
      const result = await SecuritySimulationAPI.executeSimulation(
        selectedSimulation.id, 
        payload
      )

      if (result.success) {
        const simulationWithPayload = {
          ...selectedSimulation,
          payload,
          simulationId: result.simulation_id
        }

        onSimulationStart(simulationWithPayload)
        
        // Play simulation start sound
        soundManager.playSimulationStart()
        
        toast.success(
          `${selectedSimulation.name} simulation started successfully!`, 
          { id: 'simulation-start' }
        )
        
        // Show additional details
        toast.success(
          `Simulation ID: ${result.simulation_id}\nEstimated duration: ${result.estimated_duration}s`,
          { duration: 5000 }
        )
      } else {
        throw new Error('Simulation failed to start')
      }
    } catch (error) {
      console.error('Failed to start simulation:', error)
      toast.error(
        'Failed to start simulation. Running in demo mode.', 
        { id: 'simulation-start' }
      )
      
      // Fallback to demo mode
      const simulationWithPayload = {
        ...selectedSimulation,
        payload,
        simulationId: `demo_${Date.now()}`
      }
      onSimulationStart(simulationWithPayload)
    }
  }

  const handleStopSimulation = async () => {
    try {
      toast.loading('Stopping simulation...', { id: 'simulation-stop' })
      
      const result = await SecuritySimulationAPI.stopSimulations()
      
      if (result.success) {
        onSimulationStop()
        
        // Play simulation stop sound
        soundManager.playSimulationStop()
        
        toast.success('Attack simulation stopped successfully', { id: 'simulation-stop' })
      } else {
        throw new Error('Failed to stop simulation')
      }
    } catch (error) {
      console.error('Failed to stop simulation:', error)
      
      // Fallback to local stop
      onSimulationStop()
      toast.success('Simulation stopped (demo mode)', { id: 'simulation-stop' })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Attack Simulation Controls</h2>
            <p className="text-sm text-gray-600">Control and monitor security attack simulations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isRunning ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {isRunning ? 'Simulation Active' : 'Ready'}
          </div>
        </div>
      </div>

      {/* Attack Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Attack Simulation
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {attackSimulations.map((simulation) => (
            <motion.button
              key={simulation.id}
              onClick={() => setSelectedSimulation(simulation)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedSimulation?.id === simulation.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isRunning}
            >
              <div className="flex items-start space-x-3">
                <simulation.icon className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 text-sm">{simulation.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(simulation.severity)}`}>
                      {simulation.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{simulation.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Intensity Settings */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attack Intensity
        </label>
        <div className="flex space-x-3">
          {['low', 'medium', 'high'].map((level) => (
            <button
              key={level}
              onClick={() => setIntensity(level as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                intensity === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isRunning}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Current Simulation Info */}
      {isRunning && currentSimulation && (
        <motion.div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <currentSimulation.icon className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-900">Active: {currentSimulation.name}</h3>
              <p className="text-sm text-red-700">{currentSimulation.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-3">
        <motion.button
          onClick={handleStartSimulation}
          disabled={isRunning || !selectedSimulation}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: isRunning ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-5 h-5" />
          <span>Start Simulation</span>
        </motion.button>

        <motion.button
          onClick={handleStopSimulation}
          disabled={!isRunning}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: !isRunning ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Square className="w-5 h-5" />
          <span>Stop Simulation</span>
        </motion.button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Warning Message */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> These simulations will trigger real security alerts and responses. 
              Only run in demo environments with proper monitoring enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimulationControls
