import React, { useState, useEffect } from 'react'
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  TrendingUp, 
  MapPin,
  Clock,
  Brain,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useData } from '../context/DataContext'

const ScenarioTester = () => {
  const { testScenario, trafficData } = useData()
  const [formData, setFormData] = useState({
    zone: 'A',
    event: 'road_closure',
    duration: 30,
    customTraffic: '',
    customPollution: ''
  })
  
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const eventTypes = [
    { value: 'road_closure', label: 'Road Closure', icon: '🚧' },
    { value: 'pollution_spike', label: 'Pollution Spike', icon: '🏭' },
    { value: 'accident', label: 'Traffic Accident', icon: '🚗' },
    { value: 'construction', label: 'Construction Work', icon: '🚜' },
    { value: 'weather_event', label: 'Weather Event', icon: '🌧️' },
    { value: 'special_event', label: 'Special Event', icon: '🎉' }
  ]

  const zones = [
    { value: 'A', label: 'Zone A - Downtown' },
    { value: 'B', label: 'Zone B - Industrial' },
    { value: 'C', label: 'Zone C - Residential' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (error) setError('')
  }

  const getCurrentZoneData = () => {
    if (!trafficData?.zones) return { traffic: 50, pollution: 30 }
    
    const zone = trafficData.zones.find(z => z.id === formData.zone)
    return zone || { traffic: 50, pollution: 30 }
  }

  const handleRunScenario = async () => {
    setLoading(true)
    setError('')
    
    try {
      const currentZone = getCurrentZoneData()
      
      // Prepare scenario data
      const scenarioData = {
        ts: new Date().toISOString(),
        zones: [{
          id: formData.zone,
          traffic: formData.customTraffic ? parseInt(formData.customTraffic) : currentZone.traffic,
          pollution: formData.customPollution ? parseInt(formData.customPollution) : currentZone.pollution,
          event: formData.event,
          duration: formData.duration
        }]
      }

      const result = await testScenario(scenarioData)
      setPrediction(result)
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        zone: formData.zone,
        event: formData.event,
        duration: formData.duration,
        prediction: result
      }
      
      setHistory(prev => [historyItem, ...prev.slice(0, 4)]) // Keep last 5
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      zone: 'A',
      event: 'road_closure',
      duration: 30,
      customTraffic: '',
      customPollution: ''
    })
    setPrediction(null)
    setError('')
  }

  const getEventLabel = (eventValue) => {
    const event = eventTypes.find(e => e.value === eventValue)
    return event ? `${event.icon} ${event.label}` : eventValue
  }

  const getImpactColor = (value, baseline) => {
    const change = value - baseline
    if (change > 20) return 'text-red-600'
    if (change > 10) return 'text-orange-600'
    if (change > 0) return 'text-yellow-600'
    return 'text-green-600'
  }

  const currentZone = getCurrentZoneData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scenario Testing</h1>
        <p className="text-gray-600 mt-1">
          Test different traffic scenarios and see AI predictions for traffic patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Form */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Configure Scenario
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Zone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Zone
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => handleInputChange('zone', e.target.value)}
                  className="select w-full"
                >
                  {zones.map(zone => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Zone Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Zone Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Traffic</span>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentZone.traffic}%
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Pollution</span>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentZone.pollution}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.event}
                  onChange={(e) => handleInputChange('event', e.target.value)}
                  className="select w-full"
                >
                  {eventTypes.map(event => (
                    <option key={event.value} value={event.value}>
                      {event.icon} {event.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 30)}
                  className="input w-full"
                />
              </div>

              {/* Custom Values */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Override Current Values (Optional)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Custom Traffic %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.customTraffic}
                      onChange={(e) => handleInputChange('customTraffic', e.target.value)}
                      className="input w-full"
                      placeholder={currentZone.traffic.toString()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Custom Pollution %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.customPollution}
                      onChange={(e) => handleInputChange('customPollution', e.target.value)}
                      className="input w-full"
                      placeholder={currentZone.pollution.toString()}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleRunScenario}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Run Scenario</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* AI Prediction Results */}
          {prediction && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">AI Prediction</h2>
                {prediction.confidence && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {prediction.confidence}% confidence
                  </span>
                )}
              </div>

              {/* Predicted Values */}
              {prediction.predicted_traffic && prediction.predicted_traffic.length > 0 && (
                <div className="space-y-4">
                  {prediction.predicted_traffic.map((zone, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Zone {zone.id} Predictions</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Traffic</span>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                {Math.round(zone.predicted_traffic || zone.traffic)}%
                              </div>
                              <div className={`text-xs ${getImpactColor(zone.predicted_traffic || zone.traffic, zone.traffic)}`}>
                                {zone.predicted_traffic > zone.traffic ? '+' : ''}
                                {Math.round((zone.predicted_traffic || zone.traffic) - zone.traffic)}%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Pollution</span>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                {Math.round(zone.predicted_pollution || zone.pollution)}%
                              </div>
                              <div className={`text-xs ${getImpactColor(zone.predicted_pollution || zone.pollution, zone.pollution)}`}>
                                {zone.predicted_pollution > zone.pollution ? '+' : ''}
                                {Math.round((zone.predicted_pollution || zone.pollution) - zone.pollution)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Recommendations */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {prediction.reroute_suggested ? (
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">
                        {prediction.reroute_suggested ? 'Reroute Recommended' : 'No Reroute Needed'}
                      </span>
                    </div>
                    
                    {prediction.analysis && (
                      <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                        {prediction.analysis}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scenario History */}
          {history.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h2>
              
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">Zone {item.zone}</span>
                        <span className="text-xs text-gray-500">
                          {getEventLabel(item.event)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{item.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      Duration: {item.duration}min | 
                      Reroute: {item.prediction?.reroute_suggested ? 'Yes' : 'No'}
                      {item.prediction?.confidence && (
                        <span> | Confidence: {item.prediction.confidence}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">How to Use</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Select a zone and event type to simulate</li>
              <li>• Set duration for how long the event will last</li>
              <li>• Optionally override current traffic/pollution values</li>
              <li>• Click "Run Scenario" to get AI predictions</li>
              <li>• Review predicted changes and recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScenarioTester