import InputComponent from "../../common/input"
import Button from "../../common/button"
import { useState } from "react"
import { auth, db, storage } from "../../../firebase"
import '../style.css'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { useDispatch } from "react-redux"
import { setUser } from "../../../slices/userSlice"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import FileInput from '../../common/input/FileInput'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import avatar from '../../avatar.png';

function SignUpForm() {

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayProfile, setDisplayProfile] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState('');

  const handleSignUp = async () => {
    setLoading(true)

    if (password === confirmPassword && password.length >= 6) {
      try {
        // signing up - makes an account in firebase auth
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;
        console.log("user:", user);
        //storage the dp
        const dpRef = ref(storage, `displayPicture/${auth.currentUser.uid}/${Date.now()}`)
        await uploadBytes(dpRef,(displayProfile) ? displayProfile : avatar)

        const dpURL = await getDownloadURL(dpRef)
  
        // saving user- in the firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          name: fullName,
          email: user.email,
          photoURL:dpURL,
          uid: user.uid,
        });

        //save user in redux
        dispatch(setUser({
          name:fullName,
          email,
          uid:user.uid,
          photoURL:user.photoURL,
        }))

        //navigate
        setLoading(false)
        toast.success("Login Success")
        navigate('/profile')

      } catch (error) {
        console.error("Error:", error);
        setLoading(false)
        toast.error("SignUp failed")
      }
    } else {
      // throw an Error
      if(password != confirmPassword) {
        toast.error("Please make sure Password & confirm password are same")
      }else if(password.length < 6) {
        toast.error("Please make sure Password has a length of 6 or more")
      }
      setLoading(false)
    }
  };

  const displayProfileHandle = (file) => {
    setDisplayProfile(file)
  }
  
  return (
    <div>
        <div className="input__wrapper">
          <h1>SignUp Page</h1>

          <InputComponent
            state={fullName}
            setState={setFullName}
            placeholder="Full Name"
            type="text"
            required={true}
          />

          <InputComponent 
            state={email}
            setState={setEmail}
            placeholder="Email"
            type="email"
            required={true}
          />

          <InputComponent 
            state={password}
            setState={setPassword}
            placeholder="Password"
            type="password"
            required={true}
          />

          <InputComponent 
            state={confirmPassword}
            setState={setConfirmPassword}
            placeholder="Confirm Password"
            type="password"
            required={true}
          />

          <FileInput 
             accept="image/*"
             id="display__profile__input"
             label="Upload Profile Image"
             fileHandle={displayProfileHandle}
          />

          <Button handleClick={handleSignUp} text={loading ? "Loading..." : "Sign Up"} disabled = {loading}/>
        </div>
    </div>
  )
}

export default SignUpForm