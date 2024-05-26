import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import profile from '../images/profile.png';
import logo from '../images/logo.png';

const Navbar = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    if (userEmail && userName) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }
  }, []);

  return (
    <div className='outernavbar'>
      <div className="navbarpart1">
        <img src={logo} alt="logo" />
      </div>
      <div className="navbarpart2">
        <p>Home</p>
        <p>Track</p>
        <p>Manage</p>
      </div>
      <div className="navbarpart3">
        {isRegistered ? (
          <Link to="/account">
            <img src={profile} alt="profile" />
          </Link>
        ) : (
          <>
            <Login />
            <Signup />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
