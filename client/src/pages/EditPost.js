import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Editor from '../components/Editor'
import {URL_BACKEND} from '../config'

const EditPost = () => {
  const [tittle, setTittle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [files, setFiles] = useState("")
  const [redirect, setRedirect] = useState(false)
  const {id} = useParams()

  useEffect(()=>{
    fetch(`${URL_BACKEND}/post/`+id)
    .then(res =>{
      res.json()
      .then(postInfo =>{
        setTittle(postInfo.tittle)
        setContent(postInfo.content)
        setSummary(postInfo.summary)
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function updatePost(ev) {
    ev.preventDefault()
    const data = new FormData()
    data.set("tittle", tittle)
    data.set("summary", summary)
    data.set("content", content)
    data.set("id", id)
    if (files?.[0]) {
      data.set("file", files?.[0])
    }
    const res = await fetch(`${URL_BACKEND}/post`, {
      method: "PUT",
      body: data,
      credentials:'include',
    })
    if(res.ok){
      setRedirect(true)
    }
  }

  if(redirect){
    return <Navigate to={`/post/${id}`}/>
  }

  return (
    <form onSubmit={updatePost}>
      <input 
        type="tittle" 
        placeholder='tittle'
        value={tittle}
        onChange={ev => setTittle(ev.target.value)}
      />
      <input 
        type="summary" 
        placeholder='summary'
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      <input 
        type="file"
        onChange={ev => setFiles(ev.target.files)}
      />
      <Editor onChange={setContent} value={content}/>
      <button style={{marginTop:"5px"}}>Update Post</button>
    </form>
  )
}

export default EditPost
