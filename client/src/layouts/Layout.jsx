import React from 'react'
import Header from '../components/Header/Header'

export default function Layout(props) {
  const { currentUser, handleLogout } = props;

  return (
    <div>
      <Header
        currentUser={currentUser}
        handleLogout={handleLogout}
      />
      {props.children}
    </div>
  )
}
