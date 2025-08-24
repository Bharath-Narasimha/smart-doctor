import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, MessageCircle, MapPin, TrendingUp, Brain, User, Camera } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import UserHeader from '../components/UserHeader'
import UpcomingSchedule from '../components/UpcomingSchedule'
import DoctorFinder from '../components/DoctorFinder'
import DailyReport from '../components/DailyReport'

const Home: React.FC = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      icon: Upload,
      title: "Upload Report",
      description: "Upload medical reports",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      route: "/upload"
    },
    {
      icon: MessageCircle,
      title: "Symptom Checker",
      description: "Check your symptoms",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      route: "/symptoms"
    },
    {
      icon: MapPin,
      title: "Find Doctors",
      description: "Nearby specialists",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      route: "/doctors"
    },
    {
      icon: TrendingUp,
      title: "Health Timeline",
      description: "View your history",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      route: "/timeline"
    },
    {
      icon: User,
      title: "Health Coach",
      description: "Get guidance",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      route: "/coach"
    },
    {
      icon: Camera,
      title: "Scan Symptoms",
      description: "Visual check",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      route: "/scan"
    }
  ]

  return (
    <div className="mobile-container">
      <AppHeader />
      <div className="px-6 py-8 space-y-8">
        {/* Enhanced Header with Animation */}
        <div className="slide-in">
          <UserHeader />
        </div>

        {/* Animated Upcoming Schedule */}
        <div className="fade-in">
          <UpcomingSchedule />
        </div>
        
        {/* Enhanced Quick Actions Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text">
              Quick Actions
            </h2>
            <div className="w-8 h-8 premium-icon float-animation">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`stagger-item premium-card p-5 cursor-pointer group`}
                onClick={() => navigate(action.route)}
              >
                <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {action.description}
                </p>
                <div className="mt-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Doctor Finder */}
        <div className="fade-in">
          <DoctorFinder />
        </div>

        {/* Enhanced Daily Report */}
        <div className="fade-in">
          <DailyReport />
        </div>

        {/* Premium Stats Section */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold gradient-text">Health Insights</h3>
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-blue-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">85%</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Health Score</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">12</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Reports</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">8</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 