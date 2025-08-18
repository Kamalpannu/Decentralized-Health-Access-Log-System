import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useData } from '../../context/DataContext'

const TrafficChart = () => {
  const { trafficData } = useData()
  const [historicalData, setHistoricalData] = useState([])

  // Generate historical data for demonstration
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = []
      const now = new Date()
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        data.push({
          time: time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          timestamp: time.toISOString(),
          zoneA: Math.floor(30 + Math.random() * 50 + Math.sin(i / 4) * 20),
          zoneB: Math.floor(25 + Math.random() * 45 + Math.cos(i / 3) * 15),
          zoneC: Math.floor(20 + Math.random() * 40 + Math.sin(i / 5) * 10)
        })
      }
      
      return data
    }

    setHistoricalData(generateHistoricalData())
  }, [])

  // Update with current data
  useEffect(() => {
    if (trafficData?.zones) {
      const currentTime = new Date()
      const newDataPoint = {
        time: currentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        timestamp: currentTime.toISOString(),
        zoneA: trafficData.zones.find(z => z.id === 'A')?.traffic || 0,
        zoneB: trafficData.zones.find(z => z.id === 'B')?.traffic || 0,
        zoneC: trafficData.zones.find(z => z.id === 'C')?.traffic || 0
      }

      setHistoricalData(prev => {
        const updated = [...prev.slice(1), newDataPoint]
        return updated
      })
    }
  }, [trafficData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Traffic Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Zone A</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Zone B</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Zone C</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
              label={{ value: 'Traffic %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="zoneA"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Downtown"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="zoneB"
              stroke="#22c55e"
              strokeWidth={2}
              name="Industrial"
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="zoneC"
              stroke="#a855f7"
              strokeWidth={2}
              name="Residential"
              dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrafficChart