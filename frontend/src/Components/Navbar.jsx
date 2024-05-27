import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import logo from '../images/logo.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if(authStatus === "true")
    setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    toast.success("Logged Out");
    navigate("/")

  };

  const handleUnauthorizedAccess = () => {
    alert("You need to log in to access this page.");
  };

  return (
    <>
    <header className="flex items-center justify-between h-16 px-4 md:px-6 backdrop-blur-sm bg-white/80">
      <Link className="flex items-center gap-2" to="#">
      <img style={{width:"2vw"}} src={logo} alt="" />
      <span style={{fontWeight:"700"}}>Animal Tracker</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link className="text-sm font-medium hover:underline" to="/">
          <p style={{fontWeight:"700", fontSize:"1vw"}}>Home</p>
        </Link>
        <Link className="text-sm font-medium hover:underline" to="/track">
        <p style={{fontWeight:"700", fontSize:"1vw"}}>Track</p>
        </Link>
        <Link className="text-sm font-medium hover:underline" to="/manage">
        <p style={{fontWeight:"700", fontSize:"1vw"}}>Manage</p>
        </Link>
      </nav>
      <div className="flex p-0 m-0 align-items-center justify-center gap-2">
      {isAuthenticated ? (
          <button onClick={handleLogout} style={{fontWeight:"700"}}>Logout</button>
        ) : (
          <>
            <Login setIsAuthenticated={setIsAuthenticated} />
            <Signup setIsAuthenticated={setIsAuthenticated} />
          </>
        )}
      </div>
    </header>
    <ToastContainer />
    </>
    
    
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
