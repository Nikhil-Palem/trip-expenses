import React,{ useState } from 'react'
import './App.css'
// import Login from './components/Signup'
// import PaidPage from './components/PaidPage.jsx'
import PaidPage from './components/Paid/PaidPage'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Navbar from './components/header/Navbar'
import TourPage from './components/Tour/TourPage'
import SignIn from './components/authentication/SignIn'
import Signup from './components/authentication/Signup'
function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [User_Id, setUser_Id] = useState(0);
  const [user_name, setUsername] = useState("");
  const handleLogin=(id,username)=>{
    setIsLoggedin(true);
    setUsername(username)
    setUser_Id(id);
  }
  console.log("app",User_Id);
  const router=createBrowserRouter([
    {
      path:"/",
      element:isLoggedin?<PaidPage/>:<Signup  Signup={handleLogin}/>
    },
    {
      path:"/Signin",
      element:isLoggedin?<PaidPage/>:<SignIn SignIn={handleLogin}/>
    },
    {
      path:"/PaidPage",
      element:<><Navbar/><PaidPage User_Id={User_Id} user_name={user_name}/></>
    },
    {
    path:"/TourPage",
    element:<><Navbar/><TourPage/></>
    },
    {
      path:"/Signup",
      element:<><Signup/></>
    },
  ]);
  
  return (

    <div className="app">
      <RouterProvider router={router}/>
     </div>
  )
}

export default App
