import React from 'react'
import { 
  Car, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Navigation
} from 'lucide-react'
import { useData } from '../../context/DataContext'

const StatsCards = () => {
  const { trafficData, weatherData } = useData()

  const calculateStats = () => {
    if (!trafficData?.zones) {
      return {
        totalVehicles: 0,
        avgTraffic: 0,
        avgPollution: 0,
        activeAlerts: 0
      }
    }

    const totalVehicles = trafficData.zones.reduce((sum, zone) => sum + (zone.vehicles || 0), 0)
    const avgTraffic = Math.round(trafficData.zones.reduce((sum, zone) => sum + zone.traffic, 0) / trafficData.zones.length)
    const avgPollution = Math.round(trafficData.zones.reduce((sum, zone) => sum + zone.pollution, 0) / trafficData.zones.length)
    const activeAlerts = trafficData.zones.filter(zone => zone.traffic > 70 || zone.pollution > 60 || zone.reroute_suggested).length

    return {
      totalVehicles,
      avgTraffic,
      avgPollution,
      activeAlerts
    }
  }

  const stats = calculateStats()

  const cards = [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles.toLocaleString(),
      icon: Car,
      color: 'blue',
      change: '+5.2%',
      changeType: 'increase'
    },
    {
      title: 'Avg Traffic',
      value: `${stats.avgTraffic}%`,
      icon: Activity,
      color: stats.avgTraffic > 70 ? 'red' : stats.avgTraffic > 50 ? 'yellow' : 'green',
      change: stats.avgTraffic > 70 ? '+12%' : '-3%',
      changeType: stats.avgTraffic > 70 ? 'increase' : 'decrease'
    },
    {
      title: 'Avg Pollution',
      value: `${stats.avgPollution}%`,
      icon: TrendingUp,
      color: stats.avgPollution > 60 ? 'red' : stats.avgPollution > 40 ? 'yellow' : 'green',
      change: stats.avgPollution > 60 ? '+8%' : '-2%',
      changeType: stats.avgPollution > 60 ? 'increase' : 'decrease'
    },
    {
      title: 'Active Alerts',
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: stats.activeAlerts > 2 ? 'red' : stats.activeAlerts > 0 ? 'yellow' : 'green',
      change: stats.activeAlerts > 0 ? `${stats.activeAlerts} zones` : 'All clear',
      changeType: stats.activeAlerts > 0 ? 'neutral' : 'decrease'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        text: 'text-blue-900'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        text: 'text-green-900'
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        text: 'text-yellow-900'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        text: 'text-red-900'
      }
    }
    return colors[color] || colors.blue
  }

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'increase':
        return 'text-red-600'
      case 'decrease':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const colorClasses = getColorClasses(card.color)
        const Icon = card.icon

        return (
          <div key={index} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
                <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${colorClasses.text}`}>
                  {card.value}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-sm font-medium ${getChangeColor(card.changeType)}`}>
                {card.change}
              </span>
              <span className="text-xs text-gray-500">vs last hour</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards