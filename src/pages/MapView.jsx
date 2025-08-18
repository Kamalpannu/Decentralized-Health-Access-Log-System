import React, { Suspense } from 'react'
import CityMap from '../components/Map/CityMap'
import { useData } from '../context/DataContext'
import { Loader } from 'lucide-react'

const MapView = () => {
  const { selectedZone, trafficData } = useData()

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">3D City Map</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Normal Traffic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate Traffic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Heavy Traffic</span>
            </div>
          </div>
        </div>
        
        {selectedZone && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected:</strong> Zone {selectedZone.id} - Click on other zones to view their details
            </p>
          </div>
        )}
      </div>

      {/* 3D Map */}
      <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Loading 3D Map...</p>
            </div>
          </div>
        }>
          <CityMap />
        </Suspense>
      </div>

      {/* Zone Information */}
      {trafficData?.zones && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trafficData.zones.map((zone) => (
            <div key={zone.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Zone {zone.id}</h3>
                <div className={`w-3 h-3 rounded-full ${
                  zone.reroute_suggested ? 'bg-red-500' : 
                  zone.traffic > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{zone.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Traffic:</span>
                  <span className="font-medium">{zone.traffic}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pollution:</span>
                  <span className="font-medium">{zone.pollution}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicles:</span>
                  <span className="font-medium">{zone.vehicles || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Speed:</span>
                  <span className="font-medium">{Math.round(zone.avgSpeed || 0)} km/h</span>
                </div>
              </div>
              
              {zone.reroute_suggested && (
                <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Reroute Suggested
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MapView