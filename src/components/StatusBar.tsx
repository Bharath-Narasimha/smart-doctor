import React from 'react'

const StatusBar: React.FC = () => {
  return (
    <div className="status-bar">
      <div className="flex items-center space-x-1">
        <span>9:41</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-2 bg-white rounded-sm"></div>
        <div className="w-4 h-2 bg-white rounded-sm"></div>
        <div className="w-6 h-2 bg-white rounded-sm"></div>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-3 h-2 bg-white rounded-sm"></div>
        <div className="w-3 h-2 bg-white rounded-sm"></div>
        <div className="w-8 h-4 bg-white rounded-sm"></div>
      </div>
    </div>
  )
}

export default StatusBar 