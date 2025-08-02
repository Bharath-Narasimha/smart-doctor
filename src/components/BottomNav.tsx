import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, FileText, User, TrendingUp, User as UserIcon } from 'lucide-react'

const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { icon: Home, label: 'Home', route: '/', isActive: location.pathname === '/' },
    { icon: FileText, label: 'Reports', route: '/upload', isActive: location.pathname === '/upload' },
    { icon: User, label: 'Doctors', route: '/doctors', isActive: location.pathname === '/doctors' },
    { icon: TrendingUp, label: 'Timeline', route: '/timeline', isActive: location.pathname === '/timeline' },
    { icon: UserIcon, label: 'Profile', route: '/profile', isActive: location.pathname === '/profile' },
  ]

  const renderIcon = (item: any) => {
    if (item.icon === Home) return <Home className={`w-6 h-6 transition-all duration-300 ${item.isActive ? 'fill-current scale-110' : ''}`} />
    if (item.icon === FileText) return <FileText className={`w-6 h-6 transition-all duration-300 ${item.isActive ? 'fill-current scale-110' : ''}`} />
    if (item.icon === User) return <User className={`w-6 h-6 transition-all duration-300 ${item.isActive ? 'fill-current scale-110' : ''}`} />
    if (item.icon === TrendingUp) return <TrendingUp className={`w-6 h-6 transition-all duration-300 ${item.isActive ? 'fill-current scale-110' : ''}`} />
    if (item.icon === UserIcon) return <UserIcon className={`w-6 h-6 transition-all duration-300 ${item.isActive ? 'fill-current scale-110' : ''}`} />
    return null
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm premium-nav rounded-t-3xl">
      <div className="flex items-center justify-around py-6">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.route)}
            className={`flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-110 ${
              item.isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <div className="relative">
              {renderIcon(item)}
              {item.isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full pulse-animation"></div>
              )}
            </div>
            <span className={`text-xs font-semibold transition-all duration-300 ${
              item.isActive ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {item.label}
            </span>
            {item.isActive && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BottomNav 