import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Activity, FileText, AlertTriangle, Settings } from 'lucide-react'

// Import our new security components
import ZeroTrustDashboard from '../components/security/ZeroTrustDashboard'
import ThreatMap from '../components/security/ThreatMap'
import ComplianceAudit from '../components/security/ComplianceAudit'
import AdminDashboard from '../components/admin/AdminDashboard'

const SecurityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'threats' | 'compliance' | 'admin' | 'settings'>('admin')

  const tabs = [
    { id: 'admin', label: 'Admin Control Center', icon: Settings },
    { id: 'overview', label: 'Zero-Trust Overview', icon: Shield },
    { id: 'threats', label: 'Threat Monitor', icon: AlertTriangle },
    { id: 'compliance', label: 'Compliance Audit', icon: FileText }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security Command Center</h1>
          <p className="text-xl text-gray-600 mb-6">
            Real-time Zero-Trust security monitoring, threat detection, and compliance management
          </p>
          
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-green-50 border border-green-200 rounded-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Security Status</p>
                  <p className="text-2xl font-bold text-green-900">Secure</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </motion.div>
            
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Agents</p>
                  <p className="text-2xl font-bold text-blue-900">5</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>
            
            <motion.div
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Threats Blocked</p>
                  <p className="text-2xl font-bold text-yellow-900">127</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </motion.div>
            
            <motion.div
              className="bg-purple-50 border border-purple-200 rounded-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Compliance Score</p>
                  <p className="text-2xl font-bold text-purple-900">91%</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </motion.div>
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
          {activeTab === 'admin' && (
            <AdminDashboard />
          )}
          
          {activeTab === 'overview' && (
            <ZeroTrustDashboard className="mb-8" />
          )}
          
          {activeTab === 'threats' && (
            <ThreatMap className="mb-8" />
          )}
          
          {activeTab === 'compliance' && (
            <ComplianceAudit className="mb-8" />
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-8">
                {/* Zero-Trust Configuration */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Zero-Trust Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Level
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Maximum Security</option>
                        <option>High Security</option>
                        <option>Standard Security</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agent Response Mode
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Automatic Block</option>
                        <option>Alert & Manual Review</option>
                        <option>Monitor Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Threat Detection */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Threat Detection</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Real-time Fraud Detection</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Behavioral Analysis</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Geographic Anomaly Detection</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compliance Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Monitoring</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">GDPR Compliance Tracking</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">PCI DSS Monitoring</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Automated Audit Reports</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default SecurityDashboard
