import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, FileText, Calendar, Settings, Shield, LogOut, Edit, Camera, Bell, Heart, CreditCard } from 'lucide-react'
import StatusBar from '../components/StatusBar'

const Profile: React.FC = () => {
  const navigate = useNavigate()

  const user = {
    name: "Eshlie Alcantaro",
    email: "eshlie.alcantaro@email.com",
    phone: "+1 (555) 123-4567",
    location: "Cupertino, CA",
    age: 25,
    gender: "Female",
    avatar: "/api/placeholder/80/80"
  }

  const stats = [
    { label: "Reports Uploaded", value: "12", icon: FileText, color: "bg-blue-500" },
    { label: "Appointments", value: "8", icon: Calendar, color: "bg-green-500" },
    { label: "Health Score", value: "85%", icon: Heart, color: "bg-red-500" }
  ]

  const menuItems = [
    {
      icon: FileText,
      title: "My Reports",
      subtitle: "View uploaded medical reports",
      route: "/my-reports"
    },
    {
      icon: Calendar,
      title: "Appointments",
      subtitle: "Manage your bookings",
      route: "/appointments"
    },
    {
      icon: CreditCard,
      title: "Insurance",
      subtitle: "Upload and manage insurance",
      route: "/insurance"
    },
    {
      icon: Bell,
      title: "Notifications",
      subtitle: "Manage your alerts",
      route: "/notifications"
    },
    {
      icon: Settings,
      title: "Settings",
      subtitle: "App preferences and privacy",
      route: "/settings"
    }
  ]

  return (
    <div className="mobile-container">
      <StatusBar />
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Profile
          </h1>
          <p className="text-gray-600">
            Manage your account and health data
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-pink-600" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">{user.location} • {user.age} years old</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Security & Privacy */}
        <div className="space-y-2">
          <button className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
                <p className="text-sm text-gray-600">Manage data and privacy settings</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <button className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center space-x-2">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Smart Doctor v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile 