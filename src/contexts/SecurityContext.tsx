import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SecurityAlert {
  id: string
  type: string
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
}

interface SecurityContextType {
  alerts: SecurityAlert[]
  addAlert: (alert: SecurityAlert) => void
  removeAlert: (id: string) => void
  clearAlerts: () => void
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

export const useSecurity = () => {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider')
  }
  return context
}

interface SecurityProviderProps {
  children: ReactNode
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])

  const addAlert = (alert: SecurityAlert) => {
    setAlerts(prev => [...prev, alert])
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  return (
    <SecurityContext.Provider value={{ alerts, addAlert, removeAlert, clearAlerts }}>
      {children}
    </SecurityContext.Provider>
  )
}
