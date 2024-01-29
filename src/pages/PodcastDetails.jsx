import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {  collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from '../components/common/header';
import { toast } from 'react-toastify';
import Button from '../components/common/button'
import EpisodeDetails from '../components/startAPodcast/EpisodeDetails';
import AudioPlayer from '../components/startAPodcast/AudioPlayer';

function PodcastDetails() {
    const {id} = useParams();
    const [podcast, setpodcast] = useState('');
    const [episodeData, setEpisodesData] = useState('')
    const [playingFile,setPlayingFile] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        if(id) {
            getData()
        }else {
            toast.error('No id found')
        }
    }, [id]);

    //to get podacst details
    const getData = async () => {
      try{
        const podcastDocRef = doc(db,"podcasts",id)
        const podcastData = await getDoc(podcastDocRef)

        if(podcastData.exists()) {
            console.log('pod: ' , podcastData.data())
            setpodcast({id:id,...podcastData.data()})
        }else {
            toast.error('No podcast found with this id')
            navigate('/podcast')
        }
      }catch(error) {
        toast.error(error.message)
        navigate('/podcast')
      }
    }

    //get episode details

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'podcasts' ,id, 'episodes')),
            (querySnapShot) => {
                const episodesData = []
                querySnapShot.forEach((doc) => {
                    episodesData.push({id:id, ...doc.data()})
                })
                setEpisodesData(episodesData)
            },
            (error) => {
                console.error('Error featching episode')
            }
        )
        return () => {
            unsubscribe()
        }
    },[id])

    const handleEpisode = (file) => {
        console.log(file,podcast.displayImage)
        setPlayingFile(file)
    }

  return (
    <div>
        <Header />
        <div className="input__wrapper" style={{ marginTop: '1rem', marginBottom:'5.5rem'}}>
            {podcast?.id && (
            <>
                <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}
                >
                <h1 id="podcast_title_heading">{podcast.title}</h1>
                {podcast.createdBy === auth.currentUser.uid && (
                    <Button
                    text="Create Episode"
                    handleClick={() =>
                        navigate(`/podcast/${podcast.id}/createEpisode`)
                    }
                    width="200px"
                    />
                )}
                </div>
                <div className="banner__wrapper">
                <img src={podcast.bannerImage} alt="bannerImg" />
                </div>
                <p className="podcast__description">{podcast.description}</p>

                <h1>Episodes</h1>
                {episodeData.length > 0 ? (
                episodeData.map((episode, index) => (
                    <EpisodeDetails
                    key={index}
                    index={index + 1}
                    audioFile={episode.audioFile}
                    title={episode.title}
                    description={episode.description}
                    handleClick={(file) => handleEpisode(file)}
                    />
                ))
                ) : (
                <p>No episode uploaded</p>
                )}
            </>
            )}
        </div>
        {playingFile && (
            <div style={{ marginTop: '1rem' }}>
            <AudioPlayer audioSrc={playingFile} audioImg={podcast.displayImage} />
            </div>
        )}
        </div>

  )
}

export default PodcastDetails