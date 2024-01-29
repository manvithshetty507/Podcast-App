import React, { useEffect, useState } from 'react'
import Header from '../components/common/header'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setPodcasts } from '../slices/podcastSlice'
import { toast } from 'react-toastify'
import PodcastCard from '../components/common/podcasts/podcastCard'
import InputComponent from '../components/common/input'

function Podcast() {
  const dispatch = useDispatch()
  const podcasts = useSelector((state) => state.podcasts.podcasts)
  const [search,setSearch] = useState('');

  const filteredPodcasts = podcasts.filter((podcast) => podcast.title.trim().toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
      const unsubscribe = onSnapshot(
          query(collection(db, 'podcasts')),
          (querySnapshot) => {
              const podcastData = [];
              querySnapshot.forEach((doc) => {
                  podcastData.push({ id: doc.id, ...doc.data() });
              });
              
              dispatch(setPodcasts(podcastData));
          },
          (error) => {
              toast.error(`Error loading podcasts: ${error.message}`);
          }
      );

      return () => {
          unsubscribe();
      };
  }, [ dispatch ]); 

  return (
    <>
      <Header  />
      <div className='input__wrapper' style={{marginTop:'1rem'}}>
        <h1>Discover Podcasts</h1>
        <InputComponent 
          type="text"
          placeholder="Search"
          state={search}
          setState={setSearch}
        />
        {
          filteredPodcasts.length > 0 ? (
           <div className='podcast__flex'>
            {
              filteredPodcasts.map((item) => (
              <PodcastCard key={item.id}
                id={item.id} 
                title={item.title} 
                displayImage={item.displayImage}
              />
            ))}
           </div>
          ):(
            <p>No Current Podcasts</p>
          )
        }
      </div>
    </>
  )
}

export default Podcast