import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUpPage from './pages/SignUpPage';
import Profile from './pages/Profile';
import Podcast from './pages/Podcast'
import StartPodacast from './pages/StartPodcast'
import { doc } from "firebase/firestore"
import { onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import PrivateRoute from './components/common/PrivateRoute';
import { ContextProvider } from './context/context';
import PodcastDetails from './pages/PodcastDetails';
import CreateEpisode from './pages/CreateEpisode';

function App() {

  //const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  
  return (
    <>
      <ToastContainer />
      <ContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SignUpPage />}/>
            <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/podcast" element={<Podcast />} />
                <Route path="/startpodcast" element={<StartPodacast />} />
                <Route path='/podcast/:id' element={<PodcastDetails />}/>
                <Route path='/podcast/:id/createEpisode' element={<CreateEpisode/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ContextProvider>
    </>
  )
}

export default App
