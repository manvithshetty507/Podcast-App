import React, { useState } from 'react'
import InputComponent from '../../common/input'
import Button from '../../common/button'
import FileInput from '../../common/input/FileInput'
import { toast } from 'react-toastify'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, db, storage } from '../../../firebase'
import { collection, addDoc } from 'firebase/firestore'

function CreateAPodacast() {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [displayImage, setDisplayImage] = useState()
    const [bannerImage, setbannerImage] = useState()

    const [loading, setLoading] = useState(false)

    const createNewPodcast = async () => {
        setLoading(true)
        if(title && description && displayImage && bannerImage) {
            //upload image to firebase storage
            try {
                const bannerImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                )
                await uploadBytes(bannerImageRef,bannerImage)

                const displayImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                )

                await uploadBytes(displayImageRef,displayImage)

                const bannerImageURL = await getDownloadURL(bannerImageRef)
                const displayImageURL = await getDownloadURL(displayImageRef)

                const podcastCollectionRef = collection(db, 'podcasts');

                await addDoc(podcastCollectionRef, {
                    title: title,
                    description: description,
                    bannerImage: bannerImageURL,
                    displayImage: displayImageURL,
                    createdBy: auth.currentUser.uid
                });

                setLoading(false)
                toast.success("podcast added")
            }catch(error) {
                setLoading(false)
                toast.error(JSON.stringify(error.message))
            }
        }else {
            setLoading(false)
            toast.error('Please fill all the data')
        }
    }

    const bannerImageHandle = (file) => {
        setbannerImage(file)
    }

    const displayImageHandle = (file) => {
        setDisplayImage(file)
    }

  return (
    <div className="input__wrapper">
        <h1>Create A Podcast</h1>
        <InputComponent 
            state={title}
            setState={setTitle}
            placeholder="Poadcast Name"
            type="text"
            required={true}
        />

        <InputComponent 
            state={description}
            setState={setDescription}
            placeholder="Poadcast Description"
            type="text"
            required={true}
        />

        <FileInput 
            accept="image/*"
            id="display__image__input"
            label="Upload display image"
            fileHandle={displayImageHandle}
        />

        <FileInput 
            accept="image/*"
            id="banner__image__input"
            label="Upload Banner image"
            fileHandle={bannerImageHandle}
        />

        <Button 
            text={loading ? "loading" : "Create Podcast"}
            disabled={loading}
            handleClick={createNewPodcast}
        />
        
      </div>
  )
}

export default CreateAPodacast