import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'pending';
  score: number;
  requirements: ComplianceRequirement[];
  lastAudit: Date;
  nextAudit: Date;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'pending' | 'warning';
  category: string;
  priority: 'high' | 'medium' | 'low';
  evidence?: string;
  remediation?: string;
}

interface ComplianceAuditProps {
  className?: string;
}

const ComplianceAudit: React.FC<ComplianceAuditProps> = ({ className = '' }) => {
  const [standards, setStandards] = useState<ComplianceStandard[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch compliance data
    const fetchComplianceData = async () => {
      // Mock data
      const mockStandards: ComplianceStandard[] = [
        {
          id: 'gdpr',
          name: 'GDPR',
          description: 'General Data Protection Regulation',
          status: 'compliant',
          score: 92,
          lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          nextAudit: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
          requirements: [
            {
              id: 'gdpr_1',
              title: 'Data Encryption at Rest',
              description: 'All personal data must be encrypted when stored',
              status: 'pass',
              category: 'Data Protection',
              priority: 'high',
              evidence: 'AES-256 encryption verified on all databases'
            },
            {
              id: 'gdpr_2',
              title: 'Right to be Forgotten',
              description: 'Users must be able to request data deletion',
              status: 'pass',
              category: 'User Rights',
              priority: 'high',
              evidence: 'Data deletion API implemented and tested'
            },
            {
              id: 'gdpr_3',
              title: 'Consent Management',
              description: 'Clear consent mechanisms for data processing',
              status: 'warning',
              category: 'Consent',
              priority: 'medium',
              remediation: 'Update consent forms to be more explicit'
            }
          ]
        },
        {
          id: 'pci_dss',
          name: 'PCI DSS',
          description: 'Payment Card Industry Data Security Standard',
          status: 'partial',
          score: 78,
          lastAudit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          nextAudit: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000),
          requirements: [
            {
              id: 'pci_1',
              title: 'Secure Cardholder Data',
              description: 'Protect stored cardholder data',
              status: 'pass',
              category: 'Data Security',
              priority: 'high',
              evidence: 'Card data tokenized and encrypted'
            },
            {
              id: 'pci_2',
              title: 'Network Security',
              description: 'Maintain secure network configuration',
              status: 'fail',
              category: 'Network',
              priority: 'high',
              remediation: 'Update firewall rules and close unnecessary ports'
            },
            {
              id: 'pci_3',
              title: 'Access Control',
              description: 'Restrict access to cardholder data',
              status: 'pass',
              category: 'Access Control',
              priority: 'high',
              evidence: 'Role-based access control implemented'
            }
          ]
        },
        {
          id: 'sox',
          name: 'SOX',
          description: 'Sarbanes-Oxley Act',
          status: 'compliant',
          score: 95,
          lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          nextAudit: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
          requirements: [
            {
              id: 'sox_1',
              title: 'Financial Data Integrity',
              description: 'Ensure accuracy of financial reporting data',
              status: 'pass',
              category: 'Financial Controls',
              priority: 'high',
              evidence: 'Automated controls and audit trails verified'
            },
            {
              id: 'sox_2',
              title: 'Change Management',
              description: 'Documented change management process',
              status: 'pass',
              category: 'Process Controls',
              priority: 'medium',
              evidence: 'Change management system operational'
            }
          ]
        },
        {
          id: 'iso27001',
          name: 'ISO 27001',
          description: 'Information Security Management',
          status: 'pending',
          score: 65,
          lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          nextAudit: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          requirements: [
            {
              id: 'iso_1',
              title: 'Security Policy',
              description: 'Comprehensive information security policy',
              status: 'pending',
              category: 'Policy',
              priority: 'high',
              remediation: 'Complete security policy documentation'
            },
            {
              id: 'iso_2',
              title: 'Risk Assessment',
              description: 'Regular information security risk assessments',
              status: 'warning',
              category: 'Risk Management',
              priority: 'high',
              remediation: 'Conduct quarterly risk assessments'
            }
          ]
        }
      ];

      setStandards(mockStandards);
      
      // Calculate overall score
      const totalScore = mockStandards.reduce((sum, standard) => sum + standard.score, 0);
      setOverallScore(Math.round(totalScore / mockStandards.length));
      
      setIsLoading(false);
    };

    fetchComplianceData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial':
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'non_compliant':
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'pass':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'partial':
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'non_compliant':
      case 'fail':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
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
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Compliance Audit</h2>
              <p className="text-sm text-gray-500">Regulatory compliance monitoring and reporting</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Overall Score</p>
              <p className="text-2xl font-bold text-gray-900">{overallScore}%</p>
            </div>
            <div className="w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallScore / 100)}`}
                  className="text-blue-600 transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Standards Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {standards.map((standard) => (
            <motion.div
              key={standard.id}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedStandard(standard)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{standard.name}</h3>
                {getStatusIcon(standard.status)}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{standard.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(standard.status)}`}>
                  {formatStatus(standard.status)}
                </span>
                <span className="text-lg font-bold text-gray-900">{standard.score}%</span>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      standard.score >= 90 ? 'bg-green-500' :
                      standard.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${standard.score}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Last: {standard.lastAudit.toLocaleDateString()}</span>
                  <span>Next: {standard.nextAudit.toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed View */}
        <AnimatePresence>
          {selectedStandard && (
            <motion.div
              className="bg-gray-50 rounded-lg p-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedStandard.name}</h3>
                  <p className="text-gray-600">{selectedStandard.description}</p>
                </div>
                <button
                  onClick={() => setSelectedStandard(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Compliance Score</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedStandard.score}%</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Last Audit</span>
                  </div>
                  <p className="text-sm text-gray-900">{selectedStandard.lastAudit.toLocaleDateString()}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Next Audit</span>
                  </div>
                  <p className="text-sm text-gray-900">{selectedStandard.nextAudit.toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Requirements Status</h4>
                <div className="space-y-3">
                  {selectedStandard.requirements.map((requirement) => (
                    <div key={requirement.id} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(requirement.status)}
                            <h5 className="font-medium text-gray-900">{requirement.title}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                              {requirement.priority.charAt(0).toUpperCase() + requirement.priority.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>
                          
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Category:</span> {requirement.category}
                          </div>
                          
                          {requirement.evidence && (
                            <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                              <span className="font-medium">Evidence:</span> {requirement.evidence}
                            </div>
                          )}
                          
                          {requirement.remediation && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                              <span className="font-medium">Remediation:</span> {requirement.remediation}
                            </div>
                          )}
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                          {formatStatus(requirement.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComplianceAudit;
