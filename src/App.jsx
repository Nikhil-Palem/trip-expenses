import React, { useState, createContext } from 'react'
import './App.css'
import PaidPage from './components/Paid/PaidPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/header/Navbar'
import TourPage from './components/Tour/TourPage'
import SignIn from './components/authentication/SignIn'
import Signup from './components/authentication/Signup'
import Otp from './components/ForgotPassword/Otp'
import Reset from './components/ForgotPassword/Reset'
import ForgotPage from './components/ForgotPassword/ForgotPage'
import Profile from './components/header/Profile'
import Home from './components/Interface/Home'

export const RecoveryContext = createContext();
function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [User_Id, setUser_Id] = useState(0);
  const [user_name, setUsername] = useState("");
  const [Email, setEmail] = useState();
  const [OTP, setOTP] = useState();

  const [imageUrl, setImageUrl] = useState('');
  const BackendUrl="https://trip-expenses-website-backend.vercel.app";
  const handleLogin = (id, username) => {
    setIsLoggedin(true);
    setUsername(username)
    setUser_Id(id);
  }
  console.log("app", User_Id);
  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedin ? <PaidPage /> : <Home/>
    },
    {
      path:"/home",
      element:<Home/>
    },
    {
      path: "/Signin",
      element: isLoggedin ? <PaidPage /> : <SignIn SignIn={handleLogin} />
    },
    {
      path: "/PaidPage",
      element: <><Navbar /><PaidPage User_Id={User_Id} user_name={user_name} /></>
    },
    {
      path: "/TourPage",
      element: <><Navbar /><TourPage /></>
    },
    {
      path: "/Signup",
      element: <><Signup onSignUp={handleLogin} /></>
    },
    {
      path: "/OtpPage",
      element: <><Otp /></>
    }, {
      path: "/Reset",
      element: <><Reset /></>
    },
    {
      path: "/ForgotPage",
      element: <> <ForgotPage /></>
    },
    {
      path: "/Profile",
      element: <> <Profile /></>
    }
  ]);

  return (
    <RecoveryContext.Provider value={{ Email, setEmail, OTP, setOTP,user_name,User_Id ,isLoggedin,setIsLoggedin,imageUrl, setImageUrl,BackendUrl}}>
      <div className="app">
        <RouterProvider router={router} />
      </div>
    </RecoveryContext.Provider>
  )
}

export default App
