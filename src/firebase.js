import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCL9VaSuhPSBUHS0jcvdRktf6gn4wRTLPc",
  authDomain: "podcast-app-react-58ef7.firebaseapp.com",
  projectId: "podcast-app-react-58ef7",
  storageBucket: "podcast-app-react-58ef7.appspot.com",
  messagingSenderId: "694753090472",
  appId: "1:694753090472:web:c87be190f1a6b6189b1b9d",
  measurementId: "G-9P9FMW6B6B"
};

const app = initializeApp(firebaseConfig);

//get different service

const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export {db, storage, auth}
