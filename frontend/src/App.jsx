import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import SubscriptionPage from './components/SubscriptionPage.jsx'
import DashboardPage from './components/DashboardPage.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import SignUpPage from './components/SignUpPage.jsx'
import SignInPage from './components/SignInPage.jsx'
import HistoryPage from './components/HistoryPage.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ContactPage from './components/Contact.jsx';
import { useFirebase } from "./Firebase.jsx";
import './index.css'
import { useEffect } from 'react';

function App() {

  const firebase = useFirebase();

  useEffect(() => {
    firebase.checkAuth();
  },[]);  

  return (
    <>
      <Navbar />

      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/analysis" element={!firebase.user ? <SignInPage /> : <HistoryPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={!firebase.user ? <SignInPage /> : <ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <Footer />

      <Toaster />
    </>
  )
}

export default App;
