import React from 'react'
import { User, Bell } from 'lucide-react'

const UserHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Eshlie Alcantaro
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Cupertino - Female, 25</span>
        </div>
      </div>
      <div className="relative">
        <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-pink-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <Bell className="w-2 h-2 text-white" />
        </div>
      </div>
    </div>
  )
}

export default UserHeader 