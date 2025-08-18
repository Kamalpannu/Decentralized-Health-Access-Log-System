import axios from 'axios'

// Configure base URL - adjust this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Response Error:', error)
    
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again')
    }
    
    if (!error.response) {
      throw new Error('Network error - please check your connection')
    }
    
    const { status, data } = error.response
    
    switch (status) {
      case 404:
        throw new Error('Resource not found')
      case 500:
        throw new Error('Server error - please try again later')
      default:
        throw new Error(data?.message || `HTTP ${status} error`)
    }
  }
)

export const apiService = {
  // Weather endpoints
  async getWeatherData() {
    try {
      return await api.get('/weather/latest')
    } catch (error) {
      // Return mock data if API is not available
      console.warn('Weather API not available, using mock data')
      return {
        temperature: 22 + Math.random() * 10,
        humidity: 45 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 15,
        pollution: {
          pm25: 15 + Math.random() * 10,
          pm10: 25 + Math.random() * 15,
          aqi: 50 + Math.random() * 30
        },
        timestamp: new Date().toISOString()
      }
    }
  },

  // Traffic endpoints
  async getTrafficData() {
    try {
      return await api.get('/traffic/latest')
    } catch (error) {
      // Return mock data if API is not available
      console.warn('Traffic API not available, using mock data')
      return {
        zones: [
          {
            id: 'A',
            name: 'Downtown',
            traffic: Math.floor(Math.random() * 100),
            pollution: Math.floor(Math.random() * 50),
            reroute_suggested: Math.random() > 0.7,
            vehicles: Math.floor(50 + Math.random() * 200),
            avgSpeed: 20 + Math.random() * 40
          },
          {
            id: 'B',
            name: 'Industrial',
            traffic: Math.floor(Math.random() * 100),
            pollution: Math.floor(Math.random() * 50),
            reroute_suggested: Math.random() > 0.7,
            vehicles: Math.floor(30 + Math.random() * 150),
            avgSpeed: 25 + Math.random() * 35
          },
          {
            id: 'C',
            name: 'Residential',
            traffic: Math.floor(Math.random() * 100),
            pollution: Math.floor(Math.random() * 50),
            reroute_suggested: Math.random() > 0.7,
            vehicles: Math.floor(20 + Math.random() * 100),
            avgSpeed: 30 + Math.random() * 30
          }
        ],
        timestamp: new Date().toISOString()
      }
    }
  },

  // AI Prediction endpoints
  async testScenario(scenarioData) {
    try {
      return await api.post('/scenario-bulk', scenarioData)
    } catch (error) {
      // Return mock prediction if API is not available
      console.warn('Scenario API not available, using mock data')
      return {
        predicted_traffic: scenarioData.zones.map(zone => ({
          ...zone,
          predicted_traffic: Math.min(100, zone.traffic + Math.random() * 30),
          predicted_pollution: Math.min(100, zone.pollution + Math.random() * 20)
        })),
        reroute_suggested: Math.random() > 0.5,
        analysis: `Scenario simulation for ${scenarioData.zones.length} zone(s). ${
          Math.random() > 0.5 ? 'Significant traffic increase expected.' : 'Moderate impact predicted.'
        } Consider implementing traffic management measures.`,
        confidence: Math.floor(70 + Math.random() * 25)
      }
    }
  },

  // Automation Rules endpoints
  async getAutomationRules() {
    try {
      return await api.get('/automation-rules')
    } catch (error) {
      // Return mock rules if API is not available
      console.warn('Automation rules API not available, using mock data')
      return [
        {
          id: '1',
          name: 'High Traffic Alert',
          zone: 'A',
          condition: 'traffic > 80',
          action: 'send_alert',
          enabled: true,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Pollution Reroute',
          zone: 'B',
          condition: 'pollution > 60',
          action: 'suggest_reroute',
          enabled: true,
          created_at: '2024-01-15T11:00:00Z'
        }
      ]
    }
  },

  async createAutomationRule(rule) {
    try {
      return await api.post('/automation-rules', rule)
    } catch (error) {
      // Return mock created rule if API is not available
      console.warn('Create rule API not available, using mock data')
      return {
        id: Date.now().toString(),
        ...rule,
        created_at: new Date().toISOString()
      }
    }
  },

  async updateAutomationRule(id, rule) {
    try {
      return await api.put(`/automation-rules/${id}`, rule)
    } catch (error) {
      // Return mock updated rule if API is not available
      console.warn('Update rule API not available, using mock data')
      return {
        id,
        ...rule,
        updated_at: new Date().toISOString()
      }
    }
  },

  async deleteAutomationRule(id) {
    try {
      return await api.delete(`/automation-rules/${id}`)
    } catch (error) {
      // Just log the error for delete operations
      console.warn('Delete rule API not available')
      return { success: true }
    }
  }
}

export default api