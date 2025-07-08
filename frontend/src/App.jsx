import { useState } from 'react'
import DashboardPage from './components/DashboardPage.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import SignUpPage from './components/SignUpPage.jsx'
import SignInPage from './components/SignInPage.jsx'
import HistoryPage from './components/HistoryPage.jsx'
import './index.css'

function App() {

  return (
    <>
    <DashboardPage/>
    <HistoryPage/>
    <SignInPage/>
    <SignUpPage/>
    <ProfilePage/>
    </>
  )
}

export default App
