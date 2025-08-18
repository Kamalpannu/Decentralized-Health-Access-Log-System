import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null)
  const [trafficData, setTrafficData] = useState(null)
  const [automationRules, setAutomationRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const [weather, traffic, rules] = await Promise.all([
          apiService.getWeatherData(),
          apiService.getTrafficData(),
          apiService.getAutomationRules()
        ])
        
        setWeatherData(weather)
        setTrafficData(traffic)
        setAutomationRules(rules)
        setLastUpdate(new Date())
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch initial data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Real-time updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [weather, traffic] = await Promise.all([
          apiService.getWeatherData(),
          apiService.getTrafficData()
        ])
        
        setWeatherData(weather)
        setTrafficData(traffic)
        setLastUpdate(new Date())
      } catch (err) {
        console.error('Failed to fetch real-time data:', err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const refreshAutomationRules = async () => {
    try {
      const rules = await apiService.getAutomationRules()
      setAutomationRules(rules)
    } catch (err) {
      console.error('Failed to refresh automation rules:', err)
    }
  }

  const createAutomationRule = async (rule) => {
    try {
      const newRule = await apiService.createAutomationRule(rule)
      setAutomationRules(prev => [...prev, newRule])
      return newRule
    } catch (err) {
      throw new Error('Failed to create automation rule: ' + err.message)
    }
  }

  const updateAutomationRule = async (id, rule) => {
    try {
      const updatedRule = await apiService.updateAutomationRule(id, rule)
      setAutomationRules(prev => 
        prev.map(r => r.id === id ? updatedRule : r)
      )
      return updatedRule
    } catch (err) {
      throw new Error('Failed to update automation rule: ' + err.message)
    }
  }

  const deleteAutomationRule = async (id) => {
    try {
      await apiService.deleteAutomationRule(id)
      setAutomationRules(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      throw new Error('Failed to delete automation rule: ' + err.message)
    }
  }

  const testScenario = async (scenarioData) => {
    try {
      const prediction = await apiService.testScenario(scenarioData)
      return prediction
    } catch (err) {
      throw new Error('Failed to test scenario: ' + err.message)
    }
  }

  const value = {
    // Data
    weatherData,
    trafficData,
    automationRules,
    selectedZone,
    lastUpdate,
    
    // State
    loading,
    error,
    
    // Actions
    setSelectedZone,
    refreshAutomationRules,
    createAutomationRule,
    updateAutomationRule,
    deleteAutomationRule,
    testScenario
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}