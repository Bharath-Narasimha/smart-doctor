import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, FileText, User, Clock, Filter, TrendingUp } from 'lucide-react'
import StatusBar from '../components/StatusBar'

interface TimelineEvent {
  id: number
  type: 'upload' | 'appointment' | 'prescription' | 'test'
  title: string
  date: string
  description: string
  icon: string
  color: string
}

const Timeline: React.FC = () => {
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState('2024')
  const [selectedType, setSelectedType] = useState('All')

  const years = ['2024', '2023', '2022', '2021']
  const types = ['All', 'Uploads', 'Appointments', 'Prescriptions', 'Tests']

  const timelineEvents: TimelineEvent[] = [
    {
      id: 1,
      type: 'upload',
      title: 'Blood Test Report',
      date: 'March 15, 2024',
      description: 'Complete blood count and metabolic panel',
      icon: '📄',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Dr. Sarah Wilson',
      date: 'March 10, 2024',
      description: 'Cardiology consultation - Follow up',
      icon: '👨‍⚕️',
      color: 'bg-green-500'
    },
    {
      id: 3,
      type: 'prescription',
      title: 'Medication Prescribed',
      date: 'March 8, 2024',
      description: 'Amlodipine 5mg - Daily dosage',
      icon: '💊',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      type: 'test',
      title: 'ECG Test',
      date: 'March 5, 2024',
      description: 'Electrocardiogram - Normal results',
      icon: '❤️',
      color: 'bg-red-500'
    },
    {
      id: 5,
      type: 'upload',
      title: 'X-Ray Report',
      date: 'February 28, 2024',
      description: 'Chest X-ray - Clear lungs',
      icon: '📄',
      color: 'bg-blue-500'
    },
    {
      id: 6,
      type: 'appointment',
      title: 'Dr. Michael Chen',
      date: 'February 20, 2024',
      description: 'Dental cleaning and checkup',
      icon: '👨‍⚕️',
      color: 'bg-green-500'
    }
  ]

  const filteredEvents = timelineEvents.filter(event => {
    const matchesYear = event.date.includes(selectedYear)
    const matchesType = selectedType === 'All' || 
      (selectedType === 'Uploads' && event.type === 'upload') ||
      (selectedType === 'Appointments' && event.type === 'appointment') ||
      (selectedType === 'Prescriptions' && event.type === 'prescription') ||
      (selectedType === 'Tests' && event.type === 'test')
    return matchesYear && matchesType
  })

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'upload': return 'Upload'
      case 'appointment': return 'Appointment'
      case 'prescription': return 'Prescription'
      case 'test': return 'Test'
      default: return 'Event'
    }
  }

  return (
    <div className="mobile-container">
      <StatusBar />
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Health Timeline
          </h1>
          <p className="text-gray-600">
            Track your health journey over time
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Year Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Year</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                    selectedYear === year
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Type</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              {filteredEvents.length} events found
            </h3>
            <button className="flex items-center space-x-1 text-gray-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline Line */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    {/* Event Icon */}
                    <div className={`w-12 h-12 ${event.color} rounded-full flex items-center justify-center text-white text-xl`}>
                      {event.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.type === 'upload' ? 'bg-blue-100 text-blue-800' :
                            event.type === 'appointment' ? 'bg-green-100 text-green-800' :
                            event.type === 'prescription' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getTypeLabel(event.type)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{event.date}</span>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                          View Details
                        </button>
                        <button className="text-gray-600 text-sm hover:text-gray-700">
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or upload your first health report
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Upload Report
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Timeline 