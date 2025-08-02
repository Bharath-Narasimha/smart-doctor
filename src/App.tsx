import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UploadReport from './pages/UploadReport'
import AIResult from './pages/AIResult'
import SymptomChat from './pages/SymptomChat'
import Doctors from './pages/Doctors'
import Timeline from './pages/Timeline'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <div className="mobile-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadReport />} />
        <Route path="/result" element={<AIResult />} />
        <Route path="/symptoms" element={<SymptomChat />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App 