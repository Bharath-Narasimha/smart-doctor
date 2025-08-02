import React from 'react'
import { MoreVertical, MessageCircle } from 'lucide-react'

const UpcomingSchedule: React.FC = () => {
  const appointments = [
    {
      id: 1,
      doctor: {
        name: "Dr. Pat Gulipat",
        specialty: "Dentist",
        image: "/api/placeholder/40/40"
      },
      date: "Sunday, 27 June 2021",
      time: "08:00am - 10:00am",
      isActive: true
    },
    {
      id: 2,
      doctor: {
        name: "Dr. Sarah Wilson",
        specialty: "Cardiologist",
        image: "/api/placeholder/40/40"
      },
      date: "Thursday, 24 June 2021",
      time: "08:00am - 09:00am",
      isActive: false
    }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Upcoming schedule
        </h2>
        <button className="text-blue-600 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`flex-shrink-0 w-80 rounded-xl p-4 ${
              appointment.isActive 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold">{appointment.doctor.name}</h3>
                  <p className={`text-sm ${appointment.isActive ? 'text-blue-100' : 'text-gray-600'}`}>
                    {appointment.doctor.specialty}
                  </p>
                </div>
              </div>
              <MoreVertical className={`w-5 h-5 ${appointment.isActive ? 'text-white' : 'text-gray-400'}`} />
            </div>
            
            <div className="mb-3">
              <p className="text-sm font-medium">{appointment.date}</p>
              <p className="text-sm opacity-90">{appointment.time}</p>
            </div>
            
            {appointment.isActive && (
              <div className="flex justify-end">
                <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingSchedule 