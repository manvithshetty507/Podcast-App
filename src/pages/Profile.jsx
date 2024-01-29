import React, { useState } from 'react'
import Header from '../components/common/header'
import { useSelector } from 'react-redux'
import Loader from '../components/common/Loader'
import '../App.css'
import FileInput from '../components/common/input/FileInput'
import Button from '../components/common/button'
import InputComponent from '../components/common/input'

import { auth, db, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateDoc, doc } from "firebase/firestore"
import { toast } from 'react-toastify'

function Profile() {

    const user = useSelector((state) => state.user.user)

    const [isUpdate,setIsUpdate] = useState(false)
    const [newDp, setNewDp] = useState('')
    const [newName,setNewName] = useState('')


    const updateDisplayPic = (file) => {
      setNewDp(file)
    }

    const handleUpdate = async () => {

      if(!newDp && !newName) {
        toast.error("Please fill the changes") 
      }
      else {
        try{
          const userDocRef = doc(db, "users", user.uid);
          if(newDp) {
            const dpRef = ref(storage, `displayPicture/${auth.currentUser.uid}/${Date.now()}`)
            await uploadBytes(dpRef,newDp)
    
            const dpURL = await getDownloadURL(dpRef)
  
            //update the firestore
            await updateDoc(userDocRef, {
              photoURL: dpURL,
            }) 
          }
          if(newName) {
            await updateDoc(userDocRef, {
              name:newName,
            })
          }

          toast.success("updated")
        } catch(error) {
          toast.error(error.message)
        }
      }
    }
  return (
    <>
      <Header />
      {(user) ? (
        <div className='profile'>
          {(isUpdate) ? 
          (<div className='input__wrapper'>
            <FileInput 
              accept={'images/*'}
              id='update__dp'
              label="Upload new DP"
              fileHandle={updateDisplayPic}
            />
            <InputComponent
              type="text"
              placeholder="Enter Updated Name"
              state={newName}
              setState={setNewName}
            />

            <Button 
              handleClick = {handleUpdate}
              text = "Update"
            />
          </div>) : (
            <>
            <div className='dp__image'>
              <img src={user?.photoURL} alt="dp" />
            </div>
            <h1 id='profile__name'>{user.name}</h1>
            </>
          )}
          <Button 
            handleClick = {() => setIsUpdate((prev) => !prev)}
            text = {isUpdate ? "Go Back" : "Edit"}
            width = "250px"
          />
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default Profile