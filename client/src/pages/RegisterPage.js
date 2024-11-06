import React, { useState } from 'react'
import { URL_BACKEND } from '../config'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  async function register(ev) {
    ev.preventDefault()
    const response = await fetch(`${URL_BACKEND}/register`, {
      method: "POST",
      body: JSON.stringify({username, password}),
      headers: {"Content-Type":"application/json"},
    })
    if(response.status === 200){
      alert("Registro existoso!!")
      navigate(`/login`)
    }else{
      alert("Nombre de usuario o contraseña incorrectos!!")
    }
  }
  return (
    <form className='register' onSubmit={register}>
        <input type="text" 
        placeholder='username'
        value={username}
        onChange={ev => setUsername(ev.target.value)}
        >
        </input>
        <input 
        type="password" 
        placeholder='contraseña'
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        >
        </input>
        <button>Register</button>
    </form>
  )
}

export default RegisterPage
