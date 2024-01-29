import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './style.css'

function Header() {
  const location = useLocation()
  const path = location.pathname

  return (
    <div className='navbar'>
      <div className="gradient"></div>
        <div className='links'>
          <Link to="/" className={(path == "/") ? "active" : ""}>SignUp</Link>
          <Link to="/podcast" className={(path == "/podcast") ? "active" : ""}>Podcasts</Link>
          <Link to="/startpodcast" className={(path == "/startpodcast") ? "active" : ""}>Start a PodCast</Link>
          <Link to="/profile" className={(path == "/profile") ? "active" : ""}>Profile</Link>
        </div>
    </div>
  )
}

export default Header