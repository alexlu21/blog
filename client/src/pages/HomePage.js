import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import {URL_BACKEND} from '../config.js'

const HomePage = () => {
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    fetch(`${URL_BACKEND}/post`, {
      method: "GET",
    }).then(response =>{
      response.json().then(posts => {
        setPosts(posts)
      })
    })
  }, [])

  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post} />
      ))}
    </>
  );
}

export default HomePage
