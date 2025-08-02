import React, { useState } from 'react'
import { MoreVertical, Grid, Heart, Stethoscope } from 'lucide-react'

const DoctorFinder: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All')

  const specialties = [
    { id: 'all', name: 'All', icon: null },
    { id: 'heart', name: 'Heart Surgeon', icon: Heart },
    { id: 'dentist', name: 'Dentist', icon: Stethoscope },
    { id: 'orthopedist', name: 'Orthopedist', icon: null },
    { id: 'dermatologist', name: 'Dermatologist', icon: null },
    { id: 'neurologist', name: 'Neurologist', icon: null },
  ]

  const doctors = [
    {
      id: 1,
      name: "Dr. Rabiul Akher",
      specialty: "Orthopedi",
      image: "/api/placeholder/40/40",
      rating: 4.8,
      isOnline: false
    },
    {
      id: 2,
      name: "Dr. Alex Romanov",
      specialty: "Dentist",
      image: "/api/placeholder/40/40",
      rating: 4.9,
      isOnline: true
    }
  ]

  const renderIcon = (specialty: any) => {
    if (specialty.icon === Heart) return <Heart className="w-4 h-4" />
    if (specialty.icon === Stethoscope) return <Stethoscope className="w-4 h-4" />
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Let's find the doctor
        </h2>
        <button className="p-2 text-gray-600">
          <Grid className="w-5 h-5" />
        </button>
      </div>

      {/* Specialty Filters */}
      <div className="flex space-x-3 overflow-x-auto pb-4">
        {specialties.map((specialty) => (
          <button
            key={specialty.id}
            onClick={() => setActiveFilter(specialty.name)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === specialty.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700'
            }`}
          >
            {renderIcon(specialty)}
            <span className="text-sm font-medium">{specialty.name}</span>
          </button>
        ))}
      </div>

      {/* Doctor Cards */}
      <div className="space-y-3">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                  </div>
                  {doctor.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
              <MoreVertical className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorFinder 