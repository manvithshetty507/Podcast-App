import InputComponent from "../../common/input"
import Button from "../../common/button"
import { useState } from "react"
import '../style.css'
import { auth, db } from "../../../firebase"
import { getDoc, doc } from "firebase/firestore"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { setUser } from "../../../slices/userSlice"


function LoginForm() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const[loading,setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true);

    if (email && password) {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            const userDocRef = doc(db, "users", user.uid);

            // Use await with getDoc
            const userDocSnapshot = await getDoc(userDocRef);

            // Access the data from the snapshot
            if (userDocSnapshot.exists()) {
                const userDocData = userDocSnapshot.data();

                dispatch(setUser({
                    name: userDocData.name,
                    email: userDocData.email,
                    uid: userDocData.uid,
                }));

                setLoading(false);
                toast.success("Login Success");
                navigate('/profile');
            } else {
                setLoading(false);
                toast.error("User document does not exist. Please contact support.");
            }
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
            toast.error("Please Enter Valid Email and Password");
        }
    } else {
        setLoading(false);
        toast.error("Please Enter Email and Password");
    }
}


  return (
    <div>
        <div className="input__wrapper">
          <h1>Login Page</h1>

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

          <Button handleClick={handleLogin} text={loading ? "Loading..." : "Login"} disabled={loading}/>
        </div>
    </div>
  )
}

export default LoginForm