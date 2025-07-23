import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ArrowRight, Play, Target } from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: () => void
}

interface GuidedDemoTourProps {
  isOpen: boolean
  onClose: () => void
  onStartSimulation?: () => void
}

const GuidedDemoTour: React.FC<GuidedDemoTourProps> = ({ isOpen, onClose, onStartSimulation }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const demoSteps: DemoStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Security Command Center',
      description: 'This guided tour will show you how to use the admin dashboard to simulate and monitor security attacks.',
      target: 'dashboard-header',
      position: 'bottom'
    },
    {
      id: 'tabs',
      title: 'Navigation Tabs',
      description: 'Use these tabs to navigate between different sections: Overview, Simulations, Monitoring, Network Topology, Analytics, and Settings.',
      target: 'admin-tabs',
      position: 'bottom'
    },
    {
      id: 'simulations',
      title: 'Attack Simulations',
      description: 'Select from 6 different attack types including Account Takeover, Fraud Detection, Bot Attacks, API Abuse, Data Breach, and DDoS attacks.',
      target: 'simulation-grid',
      position: 'top'
    },
    {
      id: 'intensity',
      title: 'Attack Intensity',
      description: 'Choose the intensity level for your simulation: Low, Medium, or High. Higher intensity creates more realistic threat scenarios.',
      target: 'intensity-controls',
      position: 'top'
    },
    {
      id: 'start-simulation',
      title: 'Start Attack Simulation',
      description: 'Click this button to begin the selected attack simulation. You\'ll see real-time alerts and responses.',
      target: 'start-button',
      position: 'top',
      action: onStartSimulation
    },
    {
      id: 'monitoring',
      title: 'Real-time Monitoring',
      description: 'Switch to the Monitoring tab to see live security events, threat detection, and system responses during simulations.',
      target: 'monitoring-tab',
      position: 'bottom'
    },
    {
      id: 'network',
      title: 'Network Topology',
      description: 'View the network security topology to see how attacks propagate through your infrastructure in real-time.',
      target: 'network-tab',
      position: 'bottom'
    },
    {
      id: 'complete',
      title: 'Demo Complete!',
      description: 'You\'re now ready to explore the Security Command Center. Try different attack simulations and observe the security responses.',
      target: 'dashboard-header',
      position: 'bottom'
    }
  ]

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const executeStepAction = () => {
    const step = demoSteps[currentStep]
    if (step.action) {
      step.action()
    }
    nextStep()
  }

  const startTour = () => {
    setIsRunning(true)
    setCurrentStep(0)
  }

  const currentStepData = demoSteps[currentStep]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {!isRunning ? (
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Security Demo Tour
              </h2>
              <p className="text-gray-600 mb-6">
                Take a guided tour to learn how to use the Security Command Center's advanced features for attack simulation and monitoring.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Skip Tour
                </button>
                <button
                  onClick={startTour}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Tour</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            key={currentStep}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {currentStep + 1}
                </div>
                <span className="text-sm text-gray-500">
                  of {demoSteps.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentStepData.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / demoSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentStepData.action ? (
                <button
                  onClick={executeStepAction}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Try It</span>
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <span>{currentStep === demoSteps.length - 1 ? 'Finish' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default GuidedDemoTour
