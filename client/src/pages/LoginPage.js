import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserContext';
import { URL_BACKEND } from '../config';

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  //const [redirect, setRedirect] = useState(false)
  const {setUserInfo} = useContext(UserContext) //Importante importar arriba el "UserContext" porque sino no puede hacer la referencia

  async function login(ev){
    ev.preventDefault()
    const response = await fetch(`${URL_BACKEND}/login`, {
      method: "POST",
      body: JSON.stringify({username, password}),
      headers: {"Content-Type":"application/json"},
      credentials:'include',
    })
    if(response.ok){
      response.json().then(userInfo =>{
        setUserInfo(userInfo)
        navigate("/")
        //setRedirect(true)
      })
    }else{
      alert("Datos incorrectos")
    }
  }

  // if(redirect){
  //   return <Navigate to={'/'}/>
  // }

  return (
    <form className='login' onSubmit={login}>
        <input 
        type="text"
        placeholder="username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
        >
        </input>
        <input 
        type="password" 
        placeholder="password"
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        >
        </input>
        <button type="submit">Login</button>
    </form>
  )
}

export default LoginPage
