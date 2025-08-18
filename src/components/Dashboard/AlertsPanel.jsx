import React from 'react'
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  Car,
  Wind
} from 'lucide-react'
import { useData } from '../../context/DataContext'

const AlertsPanel = () => {
  const { trafficData, weatherData } = useData()

  const generateAlerts = () => {
    const alerts = []

    if (trafficData?.zones) {
      trafficData.zones.forEach((zone) => {
        // Traffic alerts
        if (zone.traffic > 80) {
          alerts.push({
            id: `traffic-${zone.id}`,
            type: 'danger',
            title: `Heavy Traffic in Zone ${zone.id}`,
            message: `Traffic congestion at ${zone.traffic}% in ${zone.name}`,
            icon: Car,
            timestamp: new Date(),
            action: zone.reroute_suggested ? 'Reroute suggested' : null
          })
        } else if (zone.traffic > 60) {
          alerts.push({
            id: `traffic-${zone.id}`,
            type: 'warning',
            title: `Moderate Traffic in Zone ${zone.id}`,
            message: `Traffic at ${zone.traffic}% in ${zone.name}`,
            icon: Car,
            timestamp: new Date(),
            action: zone.reroute_suggested ? 'Consider reroute' : null
          })
        }

        // Pollution alerts
        if (zone.pollution > 70) {
          alerts.push({
            id: `pollution-${zone.id}`,
            type: 'danger',
            title: `High Pollution in Zone ${zone.id}`,
            message: `Pollution level at ${zone.pollution}% in ${zone.name}`,
            icon: Wind,
            timestamp: new Date(),
            action: 'Air quality warning'
          })
        } else if (zone.pollution > 50) {
          alerts.push({
            id: `pollution-${zone.id}`,
            type: 'warning',
            title: `Elevated Pollution in Zone ${zone.id}`,
            message: `Pollution level at ${zone.pollution}% in ${zone.name}`,
            icon: Wind,
            timestamp: new Date(),
            action: 'Monitor air quality'
          })
        }

        // Reroute alerts
        if (zone.reroute_suggested) {
          alerts.push({
            id: `reroute-${zone.id}`,
            type: 'info',
            title: `Reroute Suggested for Zone ${zone.id}`,
            message: `Alternative routes recommended for ${zone.name}`,
            icon: Navigation,
            timestamp: new Date(),
            action: 'View alternatives'
          })
        }
      })
    }

    // Weather alerts
    if (weatherData) {
      if (weatherData.pollution?.aqi > 150) {
        alerts.push({
          id: 'weather-aqi',
          type: 'danger',
          title: 'Unhealthy Air Quality',
          message: `AQI: ${Math.round(weatherData.pollution.aqi)} - Limit outdoor activities`,
          icon: Wind,
          timestamp: new Date(),
          action: 'Health advisory'
        })
      }

      if (weatherData.windSpeed > 20) {
        alerts.push({
          id: 'weather-wind',
          type: 'warning',
          title: 'High Wind Speed',
          message: `Wind speed: ${Math.round(weatherData.windSpeed)} km/h`,
          icon: Wind,
          timestamp: new Date(),
          action: 'Traffic caution'
        })
      }
    }

    return alerts.sort((a, b) => {
      const priority = { danger: 3, warning: 2, info: 1, success: 0 }
      return priority[b.type] - priority[a.type]
    })
  }

  const alerts = generateAlerts()

  const getAlertStyles = (type) => {
    switch (type) {
      case 'danger':
        return {
          container: 'border-red-200 bg-red-50',
          icon: 'text-red-600',
          title: 'text-red-800',
          message: 'text-red-700',
          action: 'bg-red-100 text-red-800'
        }
      case 'warning':
        return {
          container: 'border-yellow-200 bg-yellow-50',
          icon: 'text-yellow-600',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          action: 'bg-yellow-100 text-yellow-800'
        }
      case 'info':
        return {
          container: 'border-blue-200 bg-blue-50',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-700',
          action: 'bg-blue-100 text-blue-800'
        }
      case 'success':
        return {
          container: 'border-green-200 bg-green-50',
          icon: 'text-green-600',
          title: 'text-green-800',
          message: 'text-green-700',
          action: 'bg-green-100 text-green-800'
        }
      default:
        return {
          container: 'border-gray-200 bg-gray-50',
          icon: 'text-gray-600',
          title: 'text-gray-800',
          message: 'text-gray-700',
          action: 'bg-gray-100 text-gray-800'
        }
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return AlertTriangle
      case 'warning':
        return AlertCircle
      case 'success':
        return CheckCircle
      default:
        return AlertCircle
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${alerts.length > 0 ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
          <span className="text-sm text-gray-600">
            {alerts.length} active
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const styles = getAlertStyles(alert.type)
            const AlertIcon = alert.icon || getAlertIcon(alert.type)
            
            return (
              <div
                key={alert.id}
                className={`border rounded-lg p-3 ${styles.container}`}
              >
                <div className="flex items-start space-x-3">
                  <AlertIcon className={`h-5 w-5 mt-0.5 ${styles.icon}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${styles.title}`}>
                      {alert.title}
                    </h4>
                    <p className={`text-sm mt-1 ${styles.message}`}>
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      {alert.action && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles.action}`}>
                          {alert.action}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 ml-auto">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-500">All systems normal</p>
            <p className="text-sm text-gray-400">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertsPanel