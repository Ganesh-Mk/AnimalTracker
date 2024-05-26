import React, { useState } from 'react'
import '../styles/Navbar.css'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Login from './Login'
import Signup from './Signup'
import profile from '../images/profile.png'
import logo from '../images/logo.png'
import { MessageSeverity } from 'primereact/api'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="outernavbar">
      <div className="navbarpart1">
        <img src={logo} alt="" />
      </div>
      <div className="navbarpart2">
        <p>Home</p>
        <p>Track</p>
        <p>Manage</p>
      </div>
      <div className="navbarpart3">
        <Login />
        <Signup />
        <Link to="/account">
          <img src={profile} alt="" />
        </Link>
      </div>
    </div>
  )
}

export default Navbar
