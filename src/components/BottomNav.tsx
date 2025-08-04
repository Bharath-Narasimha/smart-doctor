import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, FileText, User, TrendingUp, User as UserIcon } from 'lucide-react'

const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      route: '/', 
      isActive: location.pathname === '/',
      activeBg: 'bg-violet-500',
      hoverBg: 'bg-violet-100',
      glowColor: 'violet'
    },
    { 
      icon: FileText, 
      label: 'Reports', 
      route: '/upload', 
      isActive: location.pathname === '/upload',
      activeBg: 'bg-emerald-500',
      hoverBg: 'bg-emerald-100',
      glowColor: 'emerald'
    },
    { 
      icon: User, 
      label: 'Doctors', 
      route: '/doctors', 
      isActive: location.pathname === '/doctors',
      activeBg: 'bg-blue-500',
      hoverBg: 'bg-blue-100',
      glowColor: 'blue'
    },
    { 
      icon: TrendingUp, 
      label: 'Timeline', 
      route: '/timeline', 
      isActive: location.pathname === '/timeline',
      activeBg: 'bg-orange-500',
      hoverBg: 'bg-orange-100',
      glowColor: 'orange'
    },
    { 
      icon: UserIcon, 
      label: 'Profile', 
      route: '/profile', 
      isActive: location.pathname === '/profile',
      activeBg: 'bg-pink-500',
      hoverBg: 'bg-pink-100',
      glowColor: 'pink'
    },
  ]

  const renderIcon = (item: any) => {
    const IconComponent = item.icon
    const isActive = item.isActive
    const isHovering = isHovered === item.label

    return (
      <div className="relative">
        <IconComponent 
          className={`w-7 h-7 transition-all duration-500 ${
            isActive 
              ? 'text-white drop-shadow-2xl' 
              : 'text-gray-600 group-hover:text-gray-800'
          }`} 
        />
        
        {/* Active state glow ring */}
        {isActive && (
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping scale-150" />
        )}
      </div>
    )
  }

  return (
    <>
      {/* Advanced background with depth */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 via-black/20 to-transparent pointer-events-none z-10" />
      
      {/* Main Navigation Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        
        {/* Revolutionary floating dock */}
        <div className="relative">
          {/* Main dock container */}
          <div className="relative bg-white/95 backdrop-blur-3xl rounded-3xl border border-white/40 shadow-2xl p-3">
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
            
            {/* Navigation items with revolutionary layout */}
            <div className="relative flex items-center justify-between">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.route)}
                  onMouseEnter={() => setIsHovered(item.label)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-500 ease-out group ${
                    item.isActive 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {/* Revolutionary active background */}
                  {item.isActive && (
                    <div className={`absolute inset-0 ${item.activeBg} rounded-2xl shadow-lg animate-pulse`} />
                  )}
                  
                  {/* Hover effect with morphing */}
                  {!item.isActive && isHovered === item.label && (
                    <div className={`absolute inset-0 ${item.hoverBg} backdrop-blur-sm rounded-2xl transition-all duration-300`} />
                  )}
                  
                  {/* Content with enhanced spacing */}
                  <div className="relative z-10 flex flex-col items-center space-y-1">
                    {renderIcon(item)}
                    
                    <span className={`text-xs font-semibold transition-all duration-500 ${
                      item.isActive 
                        ? 'text-white font-bold' 
                        : 'text-gray-600 group-hover:text-gray-800'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Revolutionary active indicator */}
                  {item.isActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-3 h-1 bg-white rounded-full shadow-lg" />
                      <div className="absolute inset-0 w-3 h-1 bg-white/75 rounded-full animate-ping" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Multi-layered glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl -z-10 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl -z-20 scale-120" />
        </div>
      </div>

      {/* Revolutionary ambient elements */}
      <div className="fixed bottom-0 left-0 right-0 h-52 pointer-events-none z-5">
        {/* Primary floating elements */}
        <div className="absolute bottom-24 left-1/4 w-4 h-4 bg-violet-400/40 rounded-full animate-float-slow blur-sm" />
        <div className="absolute bottom-28 right-1/3 w-3 h-3 bg-purple-400/35 rounded-full animate-float-slower blur-sm" />
        <div className="absolute bottom-32 left-1/2 w-2 h-2 bg-pink-400/30 rounded-full animate-float blur-sm" />
        
        {/* Secondary floating elements */}
        <div className="absolute bottom-36 right-1/4 w-3 h-3 bg-emerald-400/25 rounded-full animate-float-slow blur-sm" />
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-cyan-400/20 rounded-full animate-float-slower blur-sm" />
        <div className="absolute bottom-44 right-1/2 w-3 h-3 bg-orange-400/30 rounded-full animate-float blur-sm" />
        
        {/* Tertiary floating elements */}
        <div className="absolute bottom-48 left-1/5 w-2 h-2 bg-blue-400/20 rounded-full animate-float-slow blur-sm" />
        <div className="absolute bottom-52 right-1/5 w-1 h-1 bg-indigo-400/25 rounded-full animate-float-slower blur-sm" />
      </div>
    </>
  )
}

export default BottomNav 