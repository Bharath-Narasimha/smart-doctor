import React, { useState, useEffect } from 'react'
import { Stethoscope, Bell, Search, Menu } from 'lucide-react'

const AppHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const updateTime = () => {
      setCurrentTime(new Date())
    }

    window.addEventListener('scroll', handleScroll)
    const timeInterval = setInterval(updateTime, 1000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <>
      {/* Revolutionary header background */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Advanced gradient background */}
        <div className="relative h-20 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 overflow-hidden">
          
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-4 right-0 w-24 h-24 bg-white/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white/6 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md border-b border-white/20" />
          
          {/* Main header content */}
          <div className="relative z-10 h-full flex items-center justify-between px-6">
            
            {/* Left section - Logo */}
            <div className="flex items-center space-x-4">
              {/* Revolutionary logo container */}
              <div className="relative group">
                <div className="relative bg-white/20 backdrop-blur-lg rounded-2xl p-3 border border-white/30 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30">
                  <Stethoscope className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
              </div>

              {/* Revolutionary text logo */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">
                  Smart
                </span>
                <span className="text-sm font-medium text-white/90 tracking-wider">
                  DOCTOR
                </span>
              </div>
            </div>

            {/* Center section - Time and status */}
            <div className="hidden md:flex flex-col items-center space-y-1">
              <div className="text-white/90 text-sm font-medium">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <div className="w-16 h-1 bg-white/30 rounded-full">
                <div className="w-8 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Search button */}
              <button className="relative group">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-2.5 border border-white/30 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Search className="w-5 h-5 text-white" />
                </div>
              </button>

              {/* Notification button */}
              <button className="relative group">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-2.5 border border-white/30 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Bell className="w-5 h-5 text-white" />
                  
                  {/* Notification indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white" />
                </div>
              </button>

              {/* Menu button */}
              <button className="relative group">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-2.5 border border-white/30 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Menu className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Revolutionary scroll indicator */}
        {isScrolled && (
          <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
        )}
      </div>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}

export default AppHeader 