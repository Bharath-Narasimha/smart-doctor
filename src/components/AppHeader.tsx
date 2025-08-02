import React from 'react'
import { Stethoscope } from 'lucide-react'

const AppHeader: React.FC = () => {
  return (
    <div className="app-header">
      <div className="flex items-center justify-center space-x-3">
        <div className="logo-icon">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div className="logo-text">
          <span className="logo-main">Smart</span>
          <span className="logo-secondary">Doctor</span>
        </div>
      </div>
    </div>
  )
}

export default AppHeader 