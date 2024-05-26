import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TractPage from './pages/TrackPage'
import ManagePage from './pages/ManagePage'
import Navbar from './components/Navbar'
import { PrimeReactProvider } from 'primereact/api'
import Account from './pages/Account'
import { Provider } from 'react-redux' // Import Provider from react-redux
import store from './store/store' // Import your Redux store

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
            <Route path="/account" element={<Account />} />
          </Routes>
        </Router>
      </Provider>
    </PrimeReactProvider>
  )
}
export default App
