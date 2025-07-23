import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Eye,
  MapPin,
  Clock,
  User,
  CreditCard,
  Server,
  Wifi,
  Lock
} from 'lucide-react';

interface ThreatEvent {
  id: string;
  type: 'fraud_attempt' | 'suspicious_login' | 'malware_detected' | 'data_breach' | 'phishing_attempt' | 'ddos_attack';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
  target: string;
  location?: string;
  description: string;
  blocked: boolean;
  details: any;
}

interface ThreatMapProps {
  className?: string;
}

const ThreatMap: React.FC<ThreatMapProps> = ({ className = '' }) => {
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [stats, setStats] = useState({
    totalThreats: 0,
    blocked: 0,
    activeIncidents: 0,
    lastUpdate: new Date()
  });

  // Simulate real-time threat data
  useEffect(() => {
    const generateThreat = (): ThreatEvent => {
      const types: ThreatEvent['type'][] = [
        'fraud_attempt', 
        'suspicious_login', 
        'malware_detected', 
        'data_breach', 
        'phishing_attempt', 
        'ddos_attack'
      ];
      
      const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
      const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Berlin, DE', 'Unknown'];
      
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      return {
        id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        severity,
        timestamp: new Date(),
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        target: 'eCommerce Platform',
        location: locations[Math.floor(Math.random() * locations.length)],
        description: getThreatDescription(type, severity),
        blocked: Math.random() > 0.3, // 70% chance of being blocked
        details: getThreatDetails(type)
      };
    };

    const getThreatDescription = (type: ThreatEvent['type'], severity: ThreatEvent['severity']): string => {
      const descriptions = {
        fraud_attempt: `${severity.charAt(0).toUpperCase() + severity.slice(1)} risk payment transaction detected`,
        suspicious_login: `Unusual login pattern from unrecognized device`,
        malware_detected: `${severity.charAt(0).toUpperCase() + severity.slice(1)} threat signature identified`,
        data_breach: `Unauthorized data access attempt detected`,
        phishing_attempt: `Malicious email or link targeting users`,
        ddos_attack: `${severity.charAt(0).toUpperCase() + severity.slice(1)} volume network attack`
      };
      return descriptions[type];
    };

    const getThreatDetails = (type: ThreatEvent['type']): any => {
      const details = {
        fraud_attempt: {
          amount: `$${(Math.random() * 10000).toFixed(2)}`,
          paymentMethod: 'Credit Card',
          riskScore: Math.random().toFixed(2)
        },
        suspicious_login: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          attempts: Math.floor(Math.random() * 10) + 1,
          lastKnownLocation: 'San Francisco, CA'
        },
        malware_detected: {
          filename: 'suspicious_file.exe',
          signature: 'Trojan.Generic.123456',
          quarantined: true
        },
        data_breach: {
          recordsAttempted: Math.floor(Math.random() * 1000) + 100,
          dataType: 'Customer Information',
          accessLevel: 'Database Query'
        },
        phishing_attempt: {
          targetEmails: Math.floor(Math.random() * 50) + 10,
          domain: 'fake-ecommerce.com',
          reported: Math.random() > 0.5
        },
        ddos_attack: {
          requestsPerSecond: Math.floor(Math.random() * 10000) + 1000,
          originCountries: ['Russia', 'China', 'Unknown'],
          duration: `${Math.floor(Math.random() * 30) + 1} minutes`
        }
      };
      return details[type];
    };

    // Simulate initial threats
    const initialThreats = Array.from({ length: 5 }, generateThreat);
    setThreats(initialThreats);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.6) { // 40% chance of new threat every 3 seconds
        const newThreat = generateThreat();
        setThreats(prev => [newThreat, ...prev.slice(0, 19)]); // Keep last 20 threats
        
        // Update stats
        setStats(prev => ({
          totalThreats: prev.totalThreats + 1,
          blocked: prev.blocked + (newThreat.blocked ? 1 : 0),
          activeIncidents: prev.activeIncidents + (newThreat.blocked ? 0 : 1),
          lastUpdate: new Date()
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getSeverityColor = (severity: ThreatEvent['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getThreatIcon = (type: ThreatEvent['type']) => {
    switch (type) {
      case 'fraud_attempt': return <CreditCard className="w-4 h-4" />;
      case 'suspicious_login': return <User className="w-4 h-4" />;
      case 'malware_detected': return <Shield className="w-4 h-4" />;
      case 'data_breach': return <Lock className="w-4 h-4" />;
      case 'phishing_attempt': return <Eye className="w-4 h-4" />;
      case 'ddos_attack': return <Server className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatThreatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Threat Monitor</h2>
              <p className="text-sm text-gray-500">Real-time security threat detection and analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isLive 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span>{isLive ? 'Live' : 'Paused'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Threats</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalThreats}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Blocked</p>
                <p className="text-2xl font-bold text-green-900">{stats.blocked}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Active Incidents</p>
                <p className="text-2xl font-bold text-red-900">{stats.activeIncidents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Update</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Threat Feed */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Live Threat Feed</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {threats.map((threat, index) => (
              <motion.div
                key={threat.id}
                className={`p-4 rounded-lg border-l-4 ${
                  threat.blocked ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                } hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      threat.blocked ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {getThreatIcon(threat.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {formatThreatType(threat.type)}
                        </h4>
                        <span className={`inline-block w-2 h-2 rounded-full ${getSeverityColor(threat.severity)}`} />
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {threat.severity}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{threat.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Wifi className="w-3 h-3" />
                          <span>{threat.source}</span>
                        </div>
                        {threat.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{threat.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{threat.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      threat.blocked 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {threat.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>
                
                {/* Expanded Details */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {Object.entries(threat.details).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-500">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </span>
                        <span className="ml-1 text-gray-900">{value?.toString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {threats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No threats detected</p>
              <p className="text-sm">System is secure</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatMap;
