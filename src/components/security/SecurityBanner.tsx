import React from 'react'

interface SecurityBannerProps {
  status: 'secure' | 'warning' | 'alert'
  isConnected: boolean
  alertCount: number
}

const SecurityBanner: React.FC<SecurityBannerProps> = ({ status, isConnected, alertCount }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'secure':
        return 'bg-green-100 border-green-500 text-green-700'
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700'
      case 'alert':
        return 'bg-red-100 border-red-500 text-red-700'
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'secure':
        return 'System Secure'
      case 'warning':
        return 'Security Warning'
      case 'alert':
        return 'Security Alert'
      default:
        return 'Status Unknown'
    }
  }

  return (
    <div className={`border-b-2 p-2 ${getStatusColor()}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        {alertCount > 0 && (
          <div className="text-sm">
            {alertCount} active alert{alertCount > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default SecurityBanner
