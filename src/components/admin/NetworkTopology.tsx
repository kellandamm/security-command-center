import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Network, Shield, Activity, Eye, Globe } from 'lucide-react'

interface NetworkNode {
  id: string
  name: string
  type: 'firewall' | 'server' | 'database' | 'endpoint' | 'gateway'
  status: 'secure' | 'warning' | 'critical' | 'normal'
  x: number
  y: number
  connections: string[]
}

interface SecurityEvent {
  id: string
  timestamp: Date
  attackType: string
  targetNode: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  agent: string
  action: string
  status: 'detected' | 'blocked' | 'mitigated' | 'investigating'
  description: string
  sourceIP?: string
}

interface ThreatMetrics {
  timestamp: Date
  threatsDetected: number
  threatsBlocked: number
  activeAgents: number
  responseTime: number
}

interface NetworkTopologyProps {
  simulationRunning: boolean
  currentSimulation?: any
}

const NetworkTopology: React.FC<NetworkTopologyProps> = ({ simulationRunning, currentSimulation }) => {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    {
      id: 'gateway',
      name: 'Security Gateway',
      type: 'gateway',
      status: 'secure',
      x: 50,
      y: 200,
      connections: ['firewall', 'endpoint1']
    },
    {
      id: 'firewall',
      name: 'Main Firewall',
      type: 'firewall',
      status: 'secure',
      x: 200,
      y: 100,
      connections: ['server1', 'server2']
    },
    {
      id: 'server1',
      name: 'Web Server',
      type: 'server',
      status: 'normal',
      x: 400,
      y: 80,
      connections: ['database']
    },
    {
      id: 'server2',
      name: 'API Server',
      type: 'server',
      status: 'normal',
      x: 400,
      y: 150,
      connections: ['database']
    },
    {
      id: 'database',
      name: 'Customer DB',
      type: 'database',
      status: 'secure',
      x: 600,
      y: 120,
      connections: []
    },
    {
      id: 'endpoint1',
      name: 'User Device',
      type: 'endpoint',
      status: 'normal',
      x: 200,
      y: 300,
      connections: ['server1']
    }
  ])

  const [threatPulses, setThreatPulses] = useState<{ id: string; fromNode: string; toNode: string }[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [threatMetrics, setThreatMetrics] = useState<ThreatMetrics[]>([])
  const [activeView, setActiveView] = useState<'topology' | 'events' | 'metrics'>('topology')

  // Security agents for realistic demo
  const securityAgents = [
    'Zero-Trust Agent Alpha',
    'Firewall Guardian Beta', 
    'Data Shield Gamma',
    'Network Sentinel Delta',
    'Threat Hunter Epsilon'
  ]

  // Generate realistic security events
  const generateSecurityEvent = (attackType: string, targetNode: string): SecurityEvent => {
    const agent = securityAgents[Math.floor(Math.random() * securityAgents.length)]
    const eventTypes = {
      'ddos_attack': {
        actions: ['Rate limiting applied', 'Traffic filtered', 'IP blocked', 'Load balancing activated'],
        descriptions: ['Volumetric attack detected', 'Suspicious traffic patterns', 'Connection flood detected']
      },
      'account_takeover': {
        actions: ['Account locked', 'MFA triggered', 'Session terminated', 'Alert sent to user'],
        descriptions: ['Credential stuffing attempt', 'Multiple failed logins', 'Suspicious login location']
      },
      'data_exfiltration': {
        actions: ['Data access blocked', 'Connection terminated', 'File quarantined', 'Admin notified'],
        descriptions: ['Unauthorized data access', 'Suspicious file transfer', 'Anomalous database query']
      },
      'credit_card_fraud': {
        actions: ['Transaction blocked', 'Card flagged', 'Merchant notified', 'Risk score updated'],
        descriptions: ['Fraudulent transaction pattern', 'Velocity check failed', 'Geolocation mismatch']
      },
      'bot_attack': {
        actions: ['Bot signature detected', 'CAPTCHA triggered', 'Request throttled', 'IP reputation checked'],
        descriptions: ['Automated behavior detected', 'Scraping attempt blocked', 'Non-human interaction pattern']
      },
      'api_abuse': {
        actions: ['Rate limit exceeded', 'API key suspended', 'Request queued', 'Endpoint protected'],
        descriptions: ['API flooding detected', 'Unusual request patterns', 'Resource exhaustion attempt']
      }
    }

    const eventConfig = eventTypes[attackType as keyof typeof eventTypes] || eventTypes['ddos_attack']
    const action = eventConfig.actions[Math.floor(Math.random() * eventConfig.actions.length)]
    const description = eventConfig.descriptions[Math.floor(Math.random() * eventConfig.descriptions.length)]
    
    return {
      id: `event_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      attackType,
      targetNode,
      severity: Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'high' : 'medium',
      agent,
      action,
      status: Math.random() > 0.8 ? 'investigating' : Math.random() > 0.5 ? 'blocked' : 'mitigated',
      description,
      sourceIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    }
  }

  // Update network status based on simulation and generate events
  useEffect(() => {
    if (simulationRunning && currentSimulation) {
      const interval = setInterval(() => {
        setNodes(prev => prev.map(node => {
          // Randomly update node status during simulation
          const random = Math.random()
          let newStatus = node.status

          if (currentSimulation.id === 'ddos_attack') {
            if (node.type === 'gateway' || node.type === 'firewall') {
              newStatus = random > 0.7 ? 'critical' : random > 0.4 ? 'warning' : 'secure'
            }
          } else if (currentSimulation.id === 'data_exfiltration') {
            if (node.type === 'database') {
              newStatus = random > 0.8 ? 'critical' : random > 0.5 ? 'warning' : 'secure'
            }
          } else if (currentSimulation.id === 'account_takeover') {
            if (node.type === 'endpoint') {
              newStatus = random > 0.6 ? 'warning' : 'normal'
            }
          }

          // Generate security event when status changes to warning/critical
          if (newStatus !== node.status && (newStatus === 'warning' || newStatus === 'critical')) {
            const event = generateSecurityEvent(currentSimulation.id, node.id)
            setSecurityEvents(prev => [event, ...prev.slice(0, 49)]) // Keep last 50 events
          }

          return { ...node, status: newStatus }
        }))

        // Generate threat pulses
        if (Math.random() > 0.7) {
          const sourceNode = nodes[Math.floor(Math.random() * nodes.length)]
          const targetNode = nodes[Math.floor(Math.random() * nodes.length)]
          
          if (sourceNode.id !== targetNode.id) {
            const pulseId = `pulse_${Date.now()}_${Math.random()}`
            setThreatPulses(prev => [...prev, {
              id: pulseId,
              fromNode: sourceNode.id,
              toNode: targetNode.id
            }])

            // Remove pulse after animation
            setTimeout(() => {
              setThreatPulses(prev => prev.filter(p => p.id !== pulseId))
            }, 2000)
          }
        }

        // Update threat metrics
        setThreatMetrics(prev => {
          const newMetric: ThreatMetrics = {
            timestamp: new Date(),
            threatsDetected: prev.length > 0 ? prev[0].threatsDetected + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 10),
            threatsBlocked: prev.length > 0 ? prev[0].threatsBlocked + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 8),
            activeAgents: securityAgents.length,
            responseTime: Math.floor(Math.random() * 50) + 10 // 10-60ms
          }
          return [newMetric, ...prev.slice(0, 99)] // Keep last 100 metrics
        })
      }, 1500)

      return () => clearInterval(interval)
    } else {
      // Reset to normal status when simulation stops
      setNodes(prev => prev.map(node => ({
        ...node,
        status: node.type === 'gateway' || node.type === 'firewall' || node.type === 'database' ? 'secure' : 'normal'
      })))
      setThreatPulses([])
    }
  }, [simulationRunning, currentSimulation, nodes, generateSecurityEvent, securityAgents.length])

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'firewall': return Shield
      case 'server': return Activity
      case 'database': return Network
      case 'endpoint': return Eye
      case 'gateway': return Globe
      default: return Network
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-600 bg-green-100 border-green-300'
      case 'normal': return 'text-blue-600 bg-blue-100 border-blue-300'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      case 'critical': return 'text-red-600 bg-red-100 border-red-300'
      default: return 'text-gray-600 bg-gray-100 border-gray-300'
    }
  }

  const getConnectionPath = (from: NetworkNode, to: NetworkNode) => {
    return `M ${from.x + 30} ${from.y + 30} L ${to.x + 30} ${to.y + 30}`
  }

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'low': return 'text-blue-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityBadgeColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Network className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Network Security Center</h2>
            <p className="text-sm text-gray-600">Real-time monitoring & historical analysis</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('topology')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'topology'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Network View
            </button>
            <button
              onClick={() => setActiveView('events')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'events'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Security Events ({securityEvents.length})
            </button>
            <button
              onClick={() => setActiveView('metrics')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'metrics'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Threat Metrics
            </button>
          </div>

          {simulationRunning && (
            <div className="flex items-center space-x-2">
              <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-600">
                {currentSimulation?.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Conditional View Rendering */}
      {activeView === 'topology' && (
        <>
          {/* Network Visualization */}
          <div className="relative bg-gray-50 rounded-lg p-4 min-h-[400px] overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
              {/* Connection Lines */}
              {nodes.map(node => 
                node.connections.map(connectionId => {
                  const targetNode = nodes.find(n => n.id === connectionId)
                  if (!targetNode) return null
                  
                  return (
                    <motion.path
                      key={`${node.id}-${connectionId}`}
                      d={getConnectionPath(node, targetNode)}
                      stroke="#e5e7eb"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  )
                })
              )}

              {/* Threat Pulses */}
              {threatPulses.map(pulse => {
                const fromNode = nodes.find(n => n.id === pulse.fromNode)
                const toNode = nodes.find(n => n.id === pulse.toNode)
                if (!fromNode || !toNode) return null

                return (
                  <motion.circle
                    key={pulse.id}
                    r="4"
                    fill="#ef4444"
                    initial={{ 
                      cx: fromNode.x + 30, 
                      cy: fromNode.y + 30,
                      opacity: 1
                    }}
                    animate={{ 
                      cx: toNode.x + 30, 
                      cy: toNode.y + 30,
                      opacity: 0
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                )
              })}
            </svg>

            {/* Network Nodes */}
            {nodes.map(node => {
              const NodeIcon = getNodeIcon(node.type)
              
              return (
                <motion.div
                  key={node.id}
                  className={`absolute w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer ${getStatusColor(node.status)}`}
                  style={{ left: node.x, top: node.y }}
                  whileHover={{ scale: 1.1 }}
                  animate={node.status === 'critical' ? { 
                    scale: [1, 1.1, 1],
                    boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.4)', '0 0 0 10px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)']
                  } : {}}
                  transition={{ duration: 1, repeat: node.status === 'critical' ? Infinity : 0 }}
                >
                  <NodeIcon className="w-6 h-6" />
                  <span className="text-xs font-medium mt-1">{node.name.split(' ')[0]}</span>
                  
                  {/* Status indicators */}
                  {node.status === 'warning' && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  {node.status === 'critical' && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Network Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {nodes.filter(n => n.status === 'secure').length}
              </div>
              <div className="text-sm text-gray-600">Secure Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {nodes.filter(n => n.status === 'warning').length}
              </div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {nodes.filter(n => n.status === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {threatPulses.length}
              </div>
              <div className="text-sm text-gray-600">Active Threats</div>
            </div>
          </div>
        </>
      )}

      {/* Security Events View */}
      {activeView === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Security Event Log</h3>
            <div className="text-sm text-gray-500">
              {securityEvents.length > 0 ? `Last updated: ${formatTime(securityEvents[0].timestamp)}` : 'No events recorded'}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg max-h-[500px] overflow-y-auto">
            {securityEvents.length === 0 ? (
              <div className="p-8 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No security events recorded yet.</p>
                <p className="text-sm text-gray-400 mt-2">Events will appear here when simulations are running.</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {securityEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadgeColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{event.attackType}</span>
                          <span className="text-xs text-gray-500">Target: {event.targetNode}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{event.description}</p>
                        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                          <span>Agent: {event.agent}</span>
                          <span>Action: {event.action}</span>
                          <span>Status: <span className={`font-medium ${event.status === 'blocked' ? 'text-green-600' : event.status === 'investigating' ? 'text-yellow-600' : 'text-blue-600'}`}>{event.status}</span></span>
                          <span>Source: {event.sourceIP}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-4">
                        {formatDateTime(event.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threat Metrics View */}
      {activeView === 'metrics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Threat Metrics & Analytics</h3>
            <div className="text-sm text-gray-500">
              {threatMetrics.length > 0 ? `${threatMetrics.length} data points collected` : 'No metrics available'}
            </div>
          </div>

          {/* Current Metrics Summary */}
          {threatMetrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{threatMetrics[0].threatsDetected}</div>
                <div className="text-sm text-blue-800">Threats Detected</div>
                <div className="text-xs text-blue-600 mt-1">Last 15min</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{threatMetrics[0].threatsBlocked}</div>
                <div className="text-sm text-green-800">Threats Blocked</div>
                <div className="text-xs text-green-600 mt-1">Success Rate: {Math.round((threatMetrics[0].threatsBlocked / Math.max(threatMetrics[0].threatsDetected, 1)) * 100)}%</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{threatMetrics[0].activeAgents}</div>
                <div className="text-sm text-purple-800">Active Agents</div>
                <div className="text-xs text-purple-600 mt-1">All systems</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">{threatMetrics[0].responseTime}ms</div>
                <div className="text-sm text-orange-800">Avg Response</div>
                <div className="text-xs text-orange-600 mt-1">Real-time</div>
              </div>
            </div>
          )}

          {/* Historical Metrics Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">Historical Performance</h4>
            {threatMetrics.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No metrics data available yet.</p>
                <p className="text-sm text-gray-400 mt-2">Metrics will appear here during active monitoring.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {threatMetrics.slice(0, 20).map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between bg-white rounded p-3 text-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500 font-mono">{formatTime(metric.timestamp)}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-600">Detected: <strong>{metric.threatsDetected}</strong></span>
                        <span className="text-green-600">Blocked: <strong>{metric.threatsBlocked}</strong></span>
                        <span className="text-purple-600">Agents: <strong>{metric.activeAgents}</strong></span>
                      </div>
                    </div>
                    <div className="text-orange-600 font-medium">
                      {metric.responseTime}ms
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Agent Performance */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">Security Agent Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityAgents.map((agent) => {
                const agentEvents = securityEvents.filter(e => e.agent === agent)
                const successRate = agentEvents.length > 0 ? 
                  Math.round((agentEvents.filter(e => e.status === 'blocked').length / agentEvents.length) * 100) : 0
                
                return (
                  <div key={agent} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{agent}</h5>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        successRate >= 80 ? 'bg-green-100 text-green-800' :
                        successRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {successRate}% Success
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Events Handled: <strong>{agentEvents.length}</strong></div>
                      <div>Threats Blocked: <strong>{agentEvents.filter(e => e.status === 'blocked').length}</strong></div>
                      <div>Under Investigation: <strong>{agentEvents.filter(e => e.status === 'investigating').length}</strong></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NetworkTopology
