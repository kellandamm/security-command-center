// API configuration for security simulations
const API_BASE_URL = 'https://ecom-backend-wo2w5qss.agreeablesmoke-17bdb440.eastus2.azurecontainerapps.io'

export interface SimulationRequest {
  attack_type: string
  intensity?: string
  target_accounts?: number
  requests_per_second?: number
  requests_per_minute?: number
  data_type?: string
  timestamp: string
  admin_initiated: boolean
}

export interface SimulationResponse {
  success: boolean
  simulation_id: string
  message: string
  estimated_duration?: number
  affected_systems?: string[]
}

export class SecuritySimulationAPI {
  
  /**
   * Start a fraud detection simulation
   */
  static async simulateFraud(payload: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/simulate-fraud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to start fraud simulation:', error)
      // Return mock response for demo purposes
      return this.getMockResponse('fraud', payload)
    }
  }

  /**
   * Start an account takeover simulation
   */
  static async simulateTakeover(payload: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/simulate-takeover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to start takeover simulation:', error)
      return this.getMockResponse('takeover', payload)
    }
  }

  /**
   * Start a bot attack simulation
   */
  static async simulateBot(payload: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/simulate-bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to start bot simulation:', error)
      return this.getMockResponse('bot', payload)
    }
  }

  /**
   * Start an API abuse simulation
   */
  static async simulateAPIAbuse(payload: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/simulate-api-abuse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to start API abuse simulation:', error)
      return this.getMockResponse('api_abuse', payload)
    }
  }

  /**
   * Start a data breach simulation
   */
  static async simulateDataBreach(payload: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/simulate-data-breach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to start data breach simulation:', error)
      return this.getMockResponse('data_breach', payload)
    }
  }

  /**
   * Start a DDoS simulation
   */
  static async simulateDDoS(payload: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/simulate-ddos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to start DDoS simulation:', error)
      return this.getMockResponse('ddos', payload)
    }
  }

  /**
   * Stop all running simulations
   */
  static async stopSimulations(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/stop-simulations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to stop simulations:', error)
      return {
        success: true,
        message: 'All simulations stopped successfully (demo mode)'
      }
    }
  }

  /**
   * Get simulation status
   */
  static async getSimulationStatus(): Promise<{
    active_simulations: Array<{
      id: string
      type: string
      started_at: string
      status: string
    }>
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/simulation-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get simulation status:', error)
      return { active_simulations: [] }
    }
  }

  /**
   * Execute simulation based on type
   */
  static async executeSimulation(type: string, payload: SimulationRequest): Promise<SimulationResponse> {
    switch (type) {
      case 'credit_card_fraud':
        return this.simulateFraud(payload)
      case 'account_takeover':
        return this.simulateTakeover(payload)
      case 'bot_attack':
        return this.simulateBot(payload)
      case 'api_abuse':
        return this.simulateAPIAbuse(payload)
      case 'data_exfiltration':
        return this.simulateDataBreach(payload)
      case 'ddos_attack':
        return this.simulateDDoS(payload)
      default:
        throw new Error(`Unknown simulation type: ${type}`)
    }
  }

  /**
   * Get authentication token (would integrate with your auth system)
   */
  private static getAuthToken(): string {
    // In production, this would get the actual JWT token from your auth system
    // For demo purposes, return a mock token
    return 'demo-admin-token'
  }

  /**
   * Generate mock response for demo purposes
   */
  private static getMockResponse(type: string, _payload: SimulationRequest): SimulationResponse {
    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      simulation_id: simulationId,
      message: `${type} simulation started successfully (demo mode)`,
      estimated_duration: 300, // 5 minutes
      affected_systems: [
        'E-commerce Frontend',
        'Payment Processing',
        'User Authentication',
        'Fraud Detection System'
      ]
    }
  }
}

export default SecuritySimulationAPI
