import { useState } from 'react'
import DashboardPage from './components/DashboardPage.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import SignUpPage from './components/SignUpPage.jsx'
import SignInPage from './components/SignInPage.jsx'
import './index.css'

function App() {

  return (
    <>
    <SignInPage/>
    <SignUpPage/>
    <ProfilePage/>
    <DashboardPage/>
    </>
  )
}

export default App
