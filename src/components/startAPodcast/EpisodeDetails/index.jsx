import React from 'react'
import Button from '../../common/button'

function EpisodeDetails({index, title, description, audioFile, handleClick}) {
  return (
    <div>
        <h1 id='episode__title' style={{ textAlign:'left', color:'var(--white)'}}>{index}.{title}</h1>
        <p className='episode__desc' style={{ textAlign:'left', color:'var(--purple-grey)', marginLeft:'1.3rem'}}>{description}</p>
        <Button text="play" handleClick={() => handleClick(audioFile) } width="100px" />
    </div>
  )
}

export default EpisodeDetails