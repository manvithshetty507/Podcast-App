import React, { createContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { setUser } from '../slices/userSlice';
import { auth, db } from '../firebase';
import { useDispatch } from 'react-redux';

const Context = createContext();

export const ContextProvider = ({children}) => {

    const dispatch = useDispatch()

    useEffect(() => {
        const unSubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                const unSubscribeSnapShot = onSnapshot(
                    doc(db, 'users', user.uid),
                    (userDoc) => {
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
    
                            dispatch(setUser({
                                name: userData.name,
                                email: userData.email,
                                uid: userData.uid,
                                photoURL:userData.photoURL,
                            }));
                        }
                    },
                    (error) => {
                        console.log("Error fetching user document:", error);
                    }
                );
    
                // Return the unsubscribe function for the Firestore snapshot listener
                return () => unSubscribeSnapShot();
            } else {
                // User is not logged in or logged out
                dispatch(setUser(null));
            }
        }, (error) => {
            console.log("Error in onAuthStateChanged:", error);
        });
    
        // Return the unsubscribe function for the authentication state change listener
        return () => unSubscribeAuth();
    }, []); 


  return (
   <Context.Provider value={{}}>
        {children}
   </Context.Provider>
  )
}

export default Context