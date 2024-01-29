import React, { useState } from 'react'
import Header from '../components/common/header'
import InputComponent from '../components/common/input'
import FileInput from '../components/common/input/FileInput'
import Button from '../components/common/button'
import { toast } from 'react-toastify'
import { auth, db, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router'
import { useDispatch } from 'react-redux'

function CreateEpisode() {

    const {id} = useParams()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [audioFile,setAudioFile] = useState()

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const audioFileHandle = (audioFile) => {
        setAudioFile(audioFile)
    }

    const handleAudioSubmit = async () => {
        setLoading(true)
        if(title && description && audioFile) {
            try {
                //first upload audio to storage and get URL
                const audioRef = ref(
                    storage,
                    `podcast-episode/${auth.currentUser.uid}/${Date.now()}`
                )
                await uploadBytes(audioRef, audioFile)

                //getting URL after upload
                const audioURL= await getDownloadURL(audioRef)
                const episodeData = {
                    title,
                    description,
                    audioFile:audioURL
                }

                await addDoc(
                    collection(db, "podcasts", id, "episodes"),
                    episodeData
                )
                toast.success("Added new Episode")
                setLoading(false)
                navigate(`/podcast/${id}`)
            }catch(error) {
                toast.error(error.message)
                setLoading(false)
            }
        }else {
            toast.error("Please fill all fields")
            setLoading(false)
        }
    }

  return (
    <div>
        <Header />
        <div className="input__wrapper">
            <h1>Create An Episode</h1>

            <InputComponent 
                type="text"
                placeholder="Title of the episode"
                state={title}
                setState={setTitle}
            />

            <InputComponent 
                type="text"
                placeholder="Episode description"
                state={description}
                setState={setDescription}
            />

            <FileInput 
                id="audio_podcast_input"
                accept={"audio/*"}
                label="Add your Audio"
                fileHandle={audioFileHandle}
            />

            <Button 
                handleClick={handleAudioSubmit}
                disabled={loading}
                text={loading ? "loading" : "Add Episode"}
            />
        </div>
    </div>
  )
}

export default CreateEpisode