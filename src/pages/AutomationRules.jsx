import React, { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  Search,
  Filter,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useData } from '../context/DataContext'
import RuleForm from '../components/AutomationRules/RuleForm'

const AutomationRules = () => {
  const { 
    automationRules, 
    createAutomationRule, 
    updateAutomationRule, 
    deleteAutomationRule 
  } = useData()
  
  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterZone, setFilterZone] = useState('all')
  const [filterEnabled, setFilterEnabled] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Filter rules based on search and filters
  const filteredRules = automationRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.condition.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesZone = filterZone === 'all' || rule.zone === filterZone
    
    const matchesEnabled = filterEnabled === 'all' || 
                          (filterEnabled === 'enabled' && rule.enabled) ||
                          (filterEnabled === 'disabled' && !rule.enabled)
    
    return matchesSearch && matchesZone && matchesEnabled
  })

  const handleCreateRule = () => {
    setEditingRule(null)
    setShowForm(true)
    setError('')
  }

  const handleEditRule = (rule) => {
    setEditingRule(rule)
    setShowForm(true)
    setError('')
  }

  const handleSaveRule = async (ruleData) => {
    setLoading(true)
    setError('')
    
    try {
      if (editingRule) {
        await updateAutomationRule(editingRule.id, ruleData)
      } else {
        await createAutomationRule(ruleData)
      }
      
      setShowForm(false)
      setEditingRule(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) {
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await deleteAutomationRule(ruleId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRule = async (rule) => {
    setLoading(true)
    setError('')
    
    try {
      await updateAutomationRule(rule.id, { ...rule, enabled: !rule.enabled })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getZoneName = (zoneId) => {
    const zoneNames = {
      'A': 'Downtown',
      'B': 'Industrial', 
      'C': 'Residential',
      '*': 'All Zones'
    }
    return zoneNames[zoneId] || zoneId
  }

  const getActionName = (action) => {
    const actionNames = {
      'send_alert': 'Send Alert',
      'suggest_reroute': 'Suggest Reroute',
      'adjust_signals': 'Adjust Signals',
      'notify_authorities': 'Notify Authorities',
      'trigger_warning': 'Trigger Warning'
    }
    return actionNames[action] || action
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation Rules</h1>
          <p className="text-gray-600 mt-1">
            Manage automated responses to traffic and pollution conditions
          </p>
        </div>
        <button
          onClick={handleCreateRule}
          disabled={loading}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create Rule</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Zone Filter */}
          <div className="sm:w-48">
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="select w-full"
            >
              <option value="all">All Zones</option>
              <option value="A">Zone A - Downtown</option>
              <option value="B">Zone B - Industrial</option>
              <option value="C">Zone C - Residential</option>
              <option value="*">All Zones</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:w-40">
            <select
              value={filterEnabled}
              onChange={(e) => setFilterEnabled(e.target.value)}
              className="select w-full"
            >
              <option value="all">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRules.length > 0 ? (
                filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {rule.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Zone {rule.zone === '*' ? 'All' : rule.zone}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {rule.condition}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getActionName(rule.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.enabled ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-3 w-3 mr-1" />
                            Disabled
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rule.created_at 
                        ? new Date(rule.created_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleRule(rule)}
                          disabled={loading}
                          className={`p-2 rounded-md transition-colors ${
                            rule.enabled
                              ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                              : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                          }`}
                          title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                        >
                          {rule.enabled ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditRule(rule)}
                          disabled={loading}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                          title="Edit rule"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                          title="Delete rule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No rules found</p>
                      <p className="text-sm">
                        {searchTerm || filterZone !== 'all' || filterEnabled !== 'all'
                          ? 'Try adjusting your filters or search terms'
                          : 'Create your first automation rule to get started'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rule Form Modal */}
      <RuleForm
        rule={editingRule}
        onSave={handleSaveRule}
        onCancel={() => {
          setShowForm(false)
          setEditingRule(null)
          setError('')
        }}
        isOpen={showForm}
      />
    </div>
  )
}

export default AutomationRules