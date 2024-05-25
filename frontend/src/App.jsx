import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TractPage from './pages/TrackPage'
import ManagePage from './pages/ManagePage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track" element={<TractPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </Router>
  )
}
export default App
