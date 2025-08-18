import React, { useState, useEffect } from 'react'
import { X, Save, Plus } from 'lucide-react'

const RuleForm = ({ rule, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    zone: 'A',
    condition: '',
    action: 'send_alert',
    enabled: true
  })
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || '',
        zone: rule.zone || 'A',
        condition: rule.condition || '',
        action: rule.action || 'send_alert',
        enabled: rule.enabled !== undefined ? rule.enabled : true
      })
    } else {
      setFormData({
        name: '',
        zone: 'A',
        condition: '',
        action: 'send_alert',
        enabled: true
      })
    }
    setErrors({})
  }, [rule, isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required'
    }

    if (!formData.condition.trim()) {
      newErrors.condition = 'Condition is required'
    } else {
      // Basic validation for condition format
      const validConditions = /^(traffic|pollution)\s*(>|<|>=|<=|==)\s*\d+$/
      if (!validConditions.test(formData.condition.trim())) {
        newErrors.condition = 'Invalid condition format. Use: traffic > 80 or pollution <= 50'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const zones = [
    { value: 'A', label: 'Zone A - Downtown' },
    { value: 'B', label: 'Zone B - Industrial' },
    { value: 'C', label: 'Zone C - Residential' },
    { value: '*', label: 'All Zones' }
  ]

  const actions = [
    { value: 'send_alert', label: 'Send Alert' },
    { value: 'suggest_reroute', label: 'Suggest Reroute' },
    { value: 'adjust_signals', label: 'Adjust Traffic Signals' },
    { value: 'notify_authorities', label: 'Notify Authorities' },
    { value: 'trigger_warning', label: 'Trigger Warning' }
  ]

  const conditionExamples = [
    'traffic > 80',
    'pollution >= 60',
    'traffic <= 30',
    'pollution > 70'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {rule ? 'Edit Automation Rule' : 'Create New Rule'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rule Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`input w-full ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : ''}`}
              placeholder="Enter rule name..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Zone Selection */}
          <div>
            <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-1">
              Target Zone
            </label>
            <select
              id="zone"
              value={formData.zone}
              onChange={(e) => handleChange('zone', e.target.value)}
              className="select w-full"
            >
              {zones.map(zone => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <input
              type="text"
              id="condition"
              value={formData.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
              className={`input w-full ${errors.condition ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : ''}`}
              placeholder="e.g., traffic > 80"
            />
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
            )}
            
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Examples:</p>
              <div className="flex flex-wrap gap-1">
                {conditionExamples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleChange('condition', example)}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action */}
          <div>
            <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select
              id="action"
              value={formData.action}
              onChange={(e) => handleChange('action', e.target.value)}
              className="select w-full"
            >
              {actions.map(action => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
          </div>

          {/* Enabled Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
              Enable this rule
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{rule ? 'Update Rule' : 'Create Rule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RuleForm