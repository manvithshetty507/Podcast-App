import React, { useEffect, useRef, useState } from 'react'
import {FaPlay, FaPause, FaVolumeUp, FaVolumeMute} from 'react-icons/fa'
import './style.css'

function AudioPlayer({audioSrc, audioImg}) {
    const audioRef = useRef()

    const [isPlaying, setIsPlaying] = useState(true)
    const [isMute , setIsMute] = useState(false)

    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(1)

    const togglePlay = () => {
        setIsPlaying((prevState) => !prevState)
    }

    const toggleMute = () => {
        setIsMute((prevState) => !prevState);
    }

    const handleVolume = (e) => {
        setVolume(e.target.value)
        audioRef.current.volume = e.target.value;
        if(audioRef.current.volume == 0) {
            setIsMute(true)
        }else {
            setIsMute(false)
        }
    }

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime)
    }

    const handleLoadedMetaData = () => {
        setDuration(audioRef.current.duration)
    }

    const handleTimeEnded = () => {
        setCurrentTime(0)
        setIsPlaying(false)
    }

    const handleDuration = (e) => {
        setCurrentTime(e.target.value)
        audioRef.current.currentTime = e.target.value
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    useEffect(() => {
        const audio = audioRef.current

        audio.addEventListener('timeupdate',handleTimeUpdate)
        audio.addEventListener('loadedmetadata',handleLoadedMetaData)
        audio.addEventListener('ended',handleTimeEnded)

        return () => {
            audio.removeEventListener('timeupdate',handleTimeUpdate)
            audio.removeEventListener('loadedmetadata',handleLoadedMetaData)
            audio.removeEventListener('ended',handleTimeEnded)
        }
    },[])

    useEffect(() => {
        setDuration(audioRef.current.duration)
    },[audioRef])

    useEffect(() => {
        if(isPlaying) {
            audioRef.current.play()
        }else {
            audioRef.current.pause()
        }
    },[isPlaying])

    useEffect(() => {
        if(!isMute) {
            audioRef.current.volume = 1
            setVolume(1)
        }else {
            audioRef.current.volume = 0
            setVolume(0)
        }
    },[isMute])

  return (
    <div className='custom__audio__player'>
       <img src={audioImg} alt="img" className='display__image__player'/>
       <audio ref={audioRef} src={audioSrc} ></audio>

        <p onClick={togglePlay} className='audio__btn'>{(isPlaying) ? <FaPause /> : <FaPlay />}</p>

       <div className='duration__flex '>
        <p>{formatTime(currentTime)}</p>
        <input 
            type="range" 
            onChange={handleDuration} 
            className='duration__range'
            value={currentTime}
            min={0}
            step={0.01}
            max={duration}
        />
        <p>{formatTime(duration - currentTime)}</p>
       </div>

        <div className='volume__flex'>
        <p onClick={toggleMute} className='audio__btn'>
            {isMute ? <FaVolumeMute /> : <FaVolumeUp />}
        </p>
            <input 
                type="range" 
                size='100' 
                onChange={handleVolume} 
                className='duration__range'
                max={1}
                min={0}
                step={0.01}
            />
        </div>
    </div>
  )
}

export default AudioPlayer