import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom'
import Editor from '../components/Editor'
import { URL_BACKEND } from '../config'

const CreatePost = () => {
  const [tittle, setTittle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [files, setFiles] = useState("")
  const [redirect, setRedirect] = useState(false)

  async function createNewPost(ev){
    const data = new FormData()
    data.set("tittle", tittle)
    data.set("summary", summary)
    data.set("content", content)
    data.set("file", files[0])
    ev.preventDefault()
    const response = await fetch(`${URL_BACKEND}/post`,{
      method: "POST",
      body: data,
      credentials: 'include',
    })
    if(response.ok){
      setRedirect(true)
    }
  }

  if(redirect){
    return <Navigate to={"/"}/>
  }

  return (
    <form onSubmit={createNewPost}>
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
      <button style={{marginTop:"5px"}}>Create Post</button>
    </form>
  )
}

export default CreatePost
