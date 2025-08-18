import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useData } from '../../context/DataContext'

// Building component
const Building = ({ position, height, color = '#6b7280', onClick, isSelected }) => {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.material.emissive.setHex(0x444444)
    } else if (meshRef.current) {
      meshRef.current.material.emissive.setHex(0x000000)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[position[0], height / 2, position[2]]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <boxGeometry args={[2, height, 2]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}

// Road component
const Road = ({ start, end, width = 1 }) => {
  const direction = new THREE.Vector3().subVectors(
    new THREE.Vector3(...end),
    new THREE.Vector3(...start)
  )
  const length = direction.length()
  const center = new THREE.Vector3().addVectors(
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ).multiplyScalar(0.5)

  return (
    <mesh position={[center.x, 0.01, center.z]} rotation={[0, Math.atan2(direction.x, direction.z), 0]}>
      <planeGeometry args={[width, length]} />
      <meshLambertMaterial color="#4a5568" />
    </mesh>
  )
}

// Vehicle component
const Vehicle = ({ position, color = '#ef4444', speed = 1 }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      // Simple movement animation
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[position[0], 0.2, position[2]]}>
      <boxGeometry args={[0.3, 0.2, 0.6]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}

// Pollution overlay component
const PollutionOverlay = ({ zone, pollution }) => {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  const opacity = Math.min(0.6, pollution / 100 * 0.6)
  const color = pollution > 70 ? '#dc2626' : pollution > 40 ? '#f59e0b' : '#22c55e'

  return (
    <mesh ref={meshRef} position={[zone.x, 2, zone.z]}>
      <cylinderGeometry args={[3, 3, 1, 8]} />
      <meshLambertMaterial 
        color={color} 
        transparent 
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Zone marker component
const ZoneMarker = ({ zone, data, onClick, isSelected }) => {
  const textRef = useRef()
  
  const getStatusColor = () => {
    if (data?.reroute_suggested) return '#dc2626'
    if (data?.traffic > 70) return '#f59e0b'
    return '#22c55e'
  }

  return (
    <group position={[zone.x, 0, zone.z]}>
      {/* Zone base */}
      <mesh
        onClick={() => onClick(zone)}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <cylinderGeometry args={[2.5, 2.5, 0.1, 16]} />
        <meshLambertMaterial 
          color={isSelected ? '#3b82f6' : getStatusColor()} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Zone label */}
      <Text
        ref={textRef}
        position={[0, 0.2, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {zone.id}
      </Text>
      
      {/* Info popup when selected */}
      {isSelected && data && (
        <Html position={[0, 4, 0]} center>
          <div className="bg-white p-4 rounded-lg shadow-lg border min-w-[200px]">
            <h3 className="font-bold text-lg mb-2">Zone {zone.id} - {data.name}</h3>
            <div className="space-y-1 text-sm">
              <div>Traffic: <span className="font-medium">{data.traffic}%</span></div>
              <div>Pollution: <span className="font-medium">{data.pollution}%</span></div>
              <div>Vehicles: <span className="font-medium">{data.vehicles || 0}</span></div>
              <div>Avg Speed: <span className="font-medium">{Math.round(data.avgSpeed || 0)} km/h</span></div>
              <div className="pt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  data.reroute_suggested 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {data.reroute_suggested ? 'Reroute Suggested' : 'Normal Traffic'}
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Main city scene
const CityScene = () => {
  const { trafficData, selectedZone, setSelectedZone } = useData()
  
  // Define city zones
  const zones = [
    { id: 'A', name: 'Downtown', x: -5, z: -5 },
    { id: 'B', name: 'Industrial', x: 5, z: -5 },
    { id: 'C', name: 'Residential', x: 0, z: 5 }
  ]

  // Generate buildings
  const buildings = [
    // Downtown buildings (taller)
    { position: [-7, 0, -7], height: 6, zone: 'A' },
    { position: [-3, 0, -7], height: 8, zone: 'A' },
    { position: [-7, 0, -3], height: 5, zone: 'A' },
    { position: [-3, 0, -3], height: 7, zone: 'A' },
    
    // Industrial buildings (medium)
    { position: [3, 0, -7], height: 4, zone: 'B' },
    { position: [7, 0, -7], height: 3, zone: 'B' },
    { position: [3, 0, -3], height: 4, zone: 'B' },
    { position: [7, 0, -3], height: 3, zone: 'B' },
    
    // Residential buildings (shorter)
    { position: [-2, 0, 3], height: 2, zone: 'C' },
    { position: [2, 0, 3], height: 3, zone: 'C' },
    { position: [-2, 0, 7], height: 2, zone: 'C' },
    { position: [2, 0, 7], height: 2, zone: 'C' }
  ]

  // Generate roads
  const roads = [
    { start: [-10, 0, -5], end: [10, 0, -5] }, // Horizontal main road
    { start: [0, 0, -10], end: [0, 0, 10] },   // Vertical main road
    { start: [-5, 0, -10], end: [-5, 0, 0] },  // Downtown connector
    { start: [5, 0, -10], end: [5, 0, 0] },    // Industrial connector
  ]

  // Generate vehicles based on traffic data
  const getVehicles = () => {
    if (!trafficData?.zones) return []
    
    const vehicles = []
    trafficData.zones.forEach((zoneData) => {
      const zone = zones.find(z => z.id === zoneData.id)
      if (!zone) return
      
      const vehicleCount = Math.floor((zoneData.vehicles || 50) / 20) // Scale down for performance
      for (let i = 0; i < vehicleCount; i++) {
        vehicles.push({
          position: [
            zone.x + (Math.random() - 0.5) * 8,
            0,
            zone.z + (Math.random() - 0.5) * 8
          ],
          speed: (zoneData.avgSpeed || 30) / 30,
          color: zoneData.traffic > 70 ? '#dc2626' : '#22c55e'
        })
      }
    })
    return vehicles
  }

  const vehicles = getVehicles()

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      {/* Ground */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshLambertMaterial color="#10b981" />
      </mesh>

      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building
          key={index}
          position={building.position}
          height={building.height}
          isSelected={selectedZone?.id === building.zone}
        />
      ))}

      {/* Roads */}
      {roads.map((road, index) => (
        <Road key={index} start={road.start} end={road.end} />
      ))}

      {/* Vehicles */}
      {vehicles.map((vehicle, index) => (
        <Vehicle
          key={index}
          position={vehicle.position}
          color={vehicle.color}
          speed={vehicle.speed}
        />
      ))}

      {/* Zone markers */}
      {zones.map((zone) => {
        const zoneData = trafficData?.zones?.find(z => z.id === zone.id)
        return (
          <ZoneMarker
            key={zone.id}
            zone={zone}
            data={zoneData}
            onClick={setSelectedZone}
            isSelected={selectedZone?.id === zone.id}
          />
        )
      })}

      {/* Pollution overlays */}
      {zones.map((zone) => {
        const zoneData = trafficData?.zones?.find(z => z.id === zone.id)
        if (!zoneData?.pollution) return null
        return (
          <PollutionOverlay
            key={`pollution-${zone.id}`}
            zone={zone}
            pollution={zoneData.pollution}
          />
        )
      })}

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={50}
      />
    </>
  )
}

const CityMap = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600">
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        shadows
        style={{ height: '100%', width: '100%' }}
      >
        <CityScene />
      </Canvas>
    </div>
  )
}

export default CityMap