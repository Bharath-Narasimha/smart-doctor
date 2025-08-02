import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin, Star, Clock, Phone } from 'lucide-react'
import AppHeader from '../components/AppHeader'

interface Doctor {
  id: number
  name: string
  specialty: string
  rating: number
  experience: string
  location: string
  fee: string
  isOnline: boolean
  image: string
}

const Doctors: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')

  const specialties = ['All', 'Cardiologist', 'Dentist', 'Dermatologist', 'Neurologist', 'Orthopedist', 'Pediatrician']

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      specialty: "Cardiologist",
      rating: 4.9,
      experience: "15 years",
      location: "Downtown Medical Center",
      fee: "$150",
      isOnline: true,
      image: "/api/placeholder/60/60"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dentist",
      rating: 4.8,
      experience: "12 years",
      location: "Smile Dental Clinic",
      fee: "$120",
      isOnline: false,
      image: "/api/placeholder/60/60"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      rating: 4.7,
      experience: "10 years",
      location: "Skin Care Specialists",
      fee: "$180",
      isOnline: true,
      image: "/api/placeholder/60/60"
    },
    {
      id: 4,
      name: "Dr. James Thompson",
      specialty: "Neurologist",
      rating: 4.9,
      experience: "20 years",
      location: "Neurology Institute",
      fee: "$200",
      isOnline: false,
      image: "/api/placeholder/60/60"
    }
  ]

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="mobile-container">
      <AppHeader />
      <div className="px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="slide-in">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text">
              Find Doctors
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Connect with top specialists in your area
            </p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="fade-in">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 enhanced-input text-lg"
            />
          </div>
        </div>

        {/* Enhanced Specialty Filters */}
        <div className="fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Specialty</h3>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {specialties.map((specialty, index) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  selectedSpecialty === specialty
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Doctor Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">
              {filteredDoctors.length} doctors found
            </h3>
            <button className="flex items-center space-x-2 text-gray-600 text-sm hover:text-blue-600 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="font-semibold">Filter</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredDoctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className={`stagger-item premium-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer`}
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl"></div>
                    </div>
                    {doctor.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white status-indicator"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-900 text-lg">{doctor.name}</h4>
                        <p className="text-gray-600 font-medium">{doctor.specialty}</p>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold text-gray-600">{doctor.rating}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 font-medium">{doctor.experience}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">{doctor.fee}</p>
                        <p className="text-xs text-gray-500">per consultation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 font-medium">{doctor.location}</span>
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/doctors/${doctor.id}`)
                        }}
                        className="flex-1 btn-primary py-3 px-4 text-sm font-semibold"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/book/${doctor.id}`)
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Features Section */}
        <div className="premium-card p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Why Choose Our Doctors?</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Verified Experts</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Quick Booking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors 