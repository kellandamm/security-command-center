import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Zap,
  Users,
  Database,
  FileText
} from 'lucide-react';

interface SecurityEvent {
  event_type: string;
  risk_level: string;
  user_id?: string;
  details: any;
  timestamp: string;
  source_agent?: string;
}

interface AgentStatus {
  status: string;
  last_check: string;
}

interface ZeroTrustDashboardProps {
  className?: string;
}

const ZeroTrustDashboard: React.FC<ZeroTrustDashboardProps> = ({ className = '' }) => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [agentsStatus, setAgentsStatus] = useState<Record<string, AgentStatus>>({});
  const [userRiskScore, setUserRiskScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls
        setSecurityEvents([
          {
            event_type: 'suspicious_login',
            risk_level: 'medium',
            user_id: 'user_123',
            details: { ip: '192.168.1.100', location: 'New York, US' },
            timestamp: new Date().toISOString(),
            source_agent: 'security_analyst'
          },
          {
            event_type: 'compliance_check',
            risk_level: 'low',
            details: { policy: 'GDPR', status: 'compliant' },
            timestamp: new Date(Date.now() - 300000).toISOString(),
            source_agent: 'compliance'
          }
        ]);

        setAgentsStatus({
          'security_analyst': { status: 'active', last_check: new Date().toISOString() },
          'identity': { status: 'active', last_check: new Date().toISOString() },
          'compliance': { status: 'active', last_check: new Date().toISOString() },
          'data_protection': { status: 'active', last_check: new Date().toISOString() },
          'incident_response': { status: 'active', last_check: new Date().toISOString() }
        });

        setUserRiskScore(0.3);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching security data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-red-800 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'security_analyst': return <Shield className="w-5 h-5" />;
      case 'identity': return <Users className="w-5 h-5" />;
      case 'compliance': return <FileText className="w-5 h-5" />;
      case 'data_protection': return <Database className="w-5 h-5" />;
      case 'incident_response': return <Zap className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Zero-Trust Security</h2>
              <p className="text-sm text-gray-500">Real-time security monitoring and threat detection</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
        </div>
      </div>

      {/* Risk Score Indicator */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Current Risk Level</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            userRiskScore < 0.3 ? 'bg-green-100 text-green-800' :
            userRiskScore < 0.6 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {userRiskScore < 0.3 ? 'Low Risk' :
             userRiskScore < 0.6 ? 'Medium Risk' : 'High Risk'}
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full transition-all duration-1000 ${
                userRiskScore < 0.3 ? 'bg-green-500' :
                userRiskScore < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${userRiskScore * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Secure</span>
            <span>Moderate</span>
            <span>High Risk</span>
          </div>
        </div>
      </div>

      {/* Agents Status */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(agentsStatus).map(([agentType, status]) => (
            <motion.div
              key={agentType}
              className="flex flex-col items-center p-3 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`p-2 rounded-full mb-2 ${
                status.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {getAgentIcon(agentType)}
              </div>
              <span className="text-xs font-medium text-gray-900 text-center">
                {formatEventType(agentType)}
              </span>
              <div className={`w-2 h-2 rounded-full mt-1 ${
                status.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Security Events</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>View All</span>
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {securityEvents.slice(0, 5).map((event, index) => (
              <motion.div
                key={`${event.timestamp}-${index}`}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getRiskLevelColor(event.risk_level)}`}
                onClick={() => setSelectedEvent(event)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-white rounded-full">
                      {getAgentIcon(event.source_agent || 'default')}
                    </div>
                    <div>
                      <h4 className="font-medium">{formatEventType(event.event_type)}</h4>
                      <p className="text-sm opacity-75 mt-1">
                        {event.source_agent && `Detected by ${formatEventType(event.source_agent)}`}
                      </p>
                      <p className="text-xs opacity-60 mt-2">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.risk_level === 'low' && <CheckCircle className="w-4 h-4" />}
                    {event.risk_level === 'medium' && <AlertTriangle className="w-4 h-4" />}
                    {(event.risk_level === 'high' || event.risk_level === 'critical') && 
                      <AlertTriangle className="w-4 h-4" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {securityEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent security events</p>
              <p className="text-sm">Your system is secure</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Security Event Details</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Event Type</label>
                    <p className="mt-1 text-lg">{formatEventType(selectedEvent.event_type)}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Risk Level</label>
                    <p className={`mt-1 inline-flex px-2 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(selectedEvent.risk_level)}`}>
                      {selectedEvent.risk_level.charAt(0).toUpperCase() + selectedEvent.risk_level.slice(1)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Source Agent</label>
                    <p className="mt-1">{selectedEvent.source_agent ? formatEventType(selectedEvent.source_agent) : 'Unknown'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timestamp</label>
                    <p className="mt-1">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Details</label>
                    <pre className="mt-1 text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(selectedEvent.details, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZeroTrustDashboard;
