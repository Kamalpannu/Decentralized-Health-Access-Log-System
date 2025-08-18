import React from 'react'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  CloudRain,
  Sun,
  Cloud
} from 'lucide-react'
import { useData } from '../../context/DataContext'

const WeatherPanel = () => {
  const { weatherData, loading } = useData()

  if (loading && !weatherData) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  const getWeatherIcon = () => {
    if (!weatherData) return <Cloud className="h-8 w-8 text-gray-400" />
    
    const temp = weatherData.temperature
    const humidity = weatherData.humidity
    
    if (temp > 25 && humidity < 60) {
      return <Sun className="h-8 w-8 text-yellow-500" />
    } else if (humidity > 80) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    } else {
      return <Cloud className="h-8 w-8 text-gray-500" />
    }
  }

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600 bg-green-100'
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-100'
    if (aqi <= 150) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getAQILabel = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
    return 'Unhealthy'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Weather Conditions</h3>
        {getWeatherIcon()}
      </div>

      {weatherData ? (
        <div className="space-y-4">
          {/* Temperature */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700">Temperature</span>
            </div>
            <span className="text-xl font-bold text-blue-600">
              {Math.round(weatherData.temperature)}°C
            </span>
          </div>

          {/* Humidity */}
          <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Droplets className="h-5 w-5 text-cyan-600" />
              <span className="font-medium text-gray-700">Humidity</span>
            </div>
            <span className="text-xl font-bold text-cyan-600">
              {Math.round(weatherData.humidity)}%
            </span>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Wind className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Wind Speed</span>
            </div>
            <span className="text-xl font-bold text-gray-600">
              {Math.round(weatherData.windSpeed)} km/h
            </span>
          </div>

          {/* Air Quality */}
          {weatherData.pollution && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Air Quality
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">PM2.5</div>
                  <div className="text-lg font-bold text-purple-600">
                    {Math.round(weatherData.pollution.pm25)} μg/m³
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="text-sm text-gray-600">PM10</div>
                  <div className="text-lg font-bold text-indigo-600">
                    {Math.round(weatherData.pollution.pm10)} μg/m³
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-green-50 to-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">AQI</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      {Math.round(weatherData.pollution.aqi)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getAQIColor(weatherData.pollution.aqi)
                    }`}>
                      {getAQILabel(weatherData.pollution.aqi)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Last updated: {new Date(weatherData.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Cloud className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Weather data unavailable</p>
        </div>
      )}
    </div>
  )
}

export default WeatherPanel