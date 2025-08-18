import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import MapView from './pages/MapView'
import AutomationRules from './pages/AutomationRules'
import ScenarioTester from './pages/ScenarioTester'
import { DataProvider } from './context/DataContext'

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/automation" element={<AutomationRules />} />
            <Route path="/scenarios" element={<ScenarioTester />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  )
}

export default App