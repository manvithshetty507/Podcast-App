import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

function PodcastCard({id, title, displayImage}) {
  
  return (
    <Link to={`/podcast/${id}`}>
        <div className='podcast__card'>
            <img src={displayImage} className="displayimg__podcast" alt="img" />
            <p className='title__podcast'>{title}</p>
        </div>
    </Link>
  )
}

export default PodcastCard