import React from 'react';
import { Link } from 'react-router-dom'

export default function Header(props) {
  const { currentUser, handleLogout } = props;
  return (
    <header>
      <h1><Link to='/'>School App</Link></h1>
      <div>
        {currentUser
          ?
          <>
            <p>{currentUser.username}</p>
            <button onClick={handleLogout}>logout</button>
          </>
          :
          <Link to='/login'><button>Login/register</button></Link>
        }
      </div>
    </header>
  )
}
