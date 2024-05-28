import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TractPage from './pages/TrackPage'
import ManagePage from './pages/ManagePage'
import Navbar from './Components/Navbar'
import { PrimeReactProvider } from 'primereact/api'
import AccountPage from './pages/AccountPage'
import AnimalDetails from './pages/AnimalDetails'
import { Provider } from 'react-redux' // Import Provider from react-redux
import store from './store/store' // Import your Redux store
import Footer from './Components/Footer'

const App = () => {
  return (
    <PrimeReactProvider>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/track" element={<TractPage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/animaldetail" element={<AnimalDetails />} />
          </Routes>
        </Router>
        <Footer />
      </Provider>
    </PrimeReactProvider>
  )
}
export default App
