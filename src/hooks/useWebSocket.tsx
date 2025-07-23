import { useState, useEffect, useRef } from 'react'
import { buildWsUrl } from '../config/api'

interface WebSocketHook {
  socket: WebSocket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

export const useWebSocket = (endpoint: string): WebSocketHook => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectTimeoutRef = useRef<number | null>(null)

  const connect = () => {
    try {
      const wsUrl = buildWsUrl(endpoint)
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        setIsConnected(true)
        setSocket(ws)
        console.log('WebSocket connected to:', wsUrl)
      }
      
      ws.onclose = () => {
        setIsConnected(false)
        setSocket(null)
        console.log('WebSocket disconnected')
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...')
          connect()
        }, 5000)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }
      
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      setIsConnected(false)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (socket) {
      socket.close()
    }
    
    setSocket(null)
    setIsConnected(false)
  }

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [endpoint])

  return { socket, isConnected, connect, disconnect }
}
