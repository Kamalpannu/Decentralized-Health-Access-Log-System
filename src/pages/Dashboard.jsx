import React from 'react'
import StatsCards from '../components/Dashboard/StatsCards'
import TrafficChart from '../components/Dashboard/TrafficChart'
import PollutionChart from '../components/Dashboard/PollutionChart'
import WeatherPanel from '../components/Dashboard/WeatherPanel'
import AlertsPanel from '../components/Dashboard/AlertsPanel'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrafficChart />
        <PollutionChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlertsPanel />
        </div>
        <div>
          <WeatherPanel />
        </div>
      </div>
    </div>
  )
}

export default Dashboard