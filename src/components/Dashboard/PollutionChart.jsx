import React, { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useData } from '../../context/DataContext'

const PollutionChart = () => {
  const { trafficData } = useData()
  const [historicalData, setHistoricalData] = useState([])

  // Generate historical pollution data
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
          zoneA: Math.floor(20 + Math.random() * 40 + Math.sin(i / 6) * 15),
          zoneB: Math.floor(35 + Math.random() * 35 + Math.cos(i / 4) * 20),
          zoneC: Math.floor(15 + Math.random() * 30 + Math.sin(i / 8) * 10)
        })
      }
      
      return data
    }

    setHistoricalData(generateHistoricalData())
  }, [])

  // Update with current pollution data
  useEffect(() => {
    if (trafficData?.zones) {
      const currentTime = new Date()
      const newDataPoint = {
        time: currentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        timestamp: currentTime.toISOString(),
        zoneA: trafficData.zones.find(z => z.id === 'A')?.pollution || 0,
        zoneB: trafficData.zones.find(z => z.id === 'B')?.pollution || 0,
        zoneC: trafficData.zones.find(z => z.id === 'C')?.pollution || 0
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
        <h3 className="text-lg font-semibold text-gray-900">Pollution Levels</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>Zone A</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span>Zone B</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Zone C</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historicalData}>
            <defs>
              <linearGradient id="colorZoneA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorZoneB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorZoneC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
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
              label={{ value: 'Pollution %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="zoneA"
              stackId="1"
              stroke="#f87171"
              fillOpacity={1}
              fill="url(#colorZoneA)"
              name="Downtown"
            />
            <Area
              type="monotone"
              dataKey="zoneB"
              stackId="2"
              stroke="#fb923c"
              fillOpacity={1}
              fill="url(#colorZoneB)"
              name="Industrial"
            />
            <Area
              type="monotone"
              dataKey="zoneC"
              stackId="3"
              stroke="#fbbf24"
              fillOpacity={1}
              fill="url(#colorZoneC)"
              name="Residential"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PollutionChart