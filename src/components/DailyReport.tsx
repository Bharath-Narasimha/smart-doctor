import React from 'react'

const DailyReport: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Your daily report
      </h2>
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
          <p className="text-sm">Report content will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default DailyReport 