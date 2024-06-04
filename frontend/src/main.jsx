import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import { PrimeReactProvider } from 'primereact/api'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true }}>
      <App />
      <ToastContainer />
    </PrimeReactProvider>
  </React.StrictMode>,
)
