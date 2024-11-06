import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { URL_BACKEND } from '../config';

const Header = () => {
  const {userInfo, setUserInfo} = useContext(UserContext)
  const username = userInfo?.username
  useEffect(()=>{
    fetch(`${URL_BACKEND}/profile`, {
      credentials: 'include',
    }).then(response =>{
      response.json().then(userInfo=>{
        setUserInfo(userInfo)
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function logout() {
    fetch(`${URL_BACKEND}/logout`,{
      credentials: 'include',
      method: 'POST',
    })
    setUserInfo(null)
  }

  
  return (
    <header>
      <Link to="/" className="logo">Bloguitez</Link>
      <nav>
        {username && (
          <>
          <Link to={"/create"}>Crear nuevo post</Link>
          <Link onClick={logout}>Cerrar Sesión</Link>
          <div style={{fontWeight:'bold',textTransform:'capitalize'}}>{username}</div>
          </>
        )}
        {!username && (
          <>
          <Link to={"/login"}>Inicar Sesión</Link>
          <Link to={"/register"}>Crear Cuenta</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;