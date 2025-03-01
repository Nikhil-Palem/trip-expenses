import React, { useState, createContext } from 'react';
import './App.css';
import Trips from './components/Dashboard/Trips';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SignIn from './components/authentication/SignIn';
import Signup from './components/authentication/Signup';
import Otp from './components/ForgotPassword/Otp';
import Reset from './components/ForgotPassword/Reset';
import ForgotPage from './components/ForgotPassword/ForgotPage';
import Home from './components/Interface/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OAuthCallback from './OAuthCallback';
import Navbar from './components/header/Navbar';
import ProtectedRoute from './components/authentication/ProtectedRoute';
import MyTrips from './components/Dashboard/MyTrips';
import Report from './components/Dashboard/Report';
import PlaceDetails from './components/Dashboard/PlaceDetails';
import CustomPlace from './components/Dashboard/CustomPlace';
import ManageTrip from './components/Dashboard/ManageTrip';
import AddExpenses from './components/SubTasks/AddExpenses';
import Settings from './components/Settings/Settings';

export const RecoveryContext = createContext();

function App() {
  const storedState = JSON.parse(localStorage.getItem('loggedin'));
  const storedUsername = localStorage.getItem('username');
  const storedId = localStorage.getItem('userId');
  const storedEmail = localStorage.getItem('Email');
  const storedimg = localStorage.getItem('imageUrl');
  const storedCurrTripID = localStorage.getItem('currentTripID');
  
  const [isLoggedin, setIsLoggedin] = useState(storedState || false);
  const [User_Id, setUser_Id] = useState(storedId || 0);
  const [user_name, setUsername] = useState(storedUsername || '');
  const [Email, setEmail] = useState(storedEmail || '');
  const [OTP, setOTP] = useState();
  const [imageUrl, setImageUrl] = useState(storedimg || '');
  const [customPlaces, setcustomPlaces] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [CurrentTripId, setCurrentTripId] = useState(storedCurrTripID || '')
  const [currentTrip, setCurrentTrip] = useState(null);
  

  const BackendUrl = import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_URL : 'http://localhost:3000';

    
  const handleLogin = (id, username, email) => {
    setIsLoggedin(true);
    setUsername(username);
    setUser_Id(id);
    setEmail(email);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', id);
    localStorage.setItem('loggedin', true);
    localStorage.setItem('Email', email);
    localStorage.setItem('isLoggedin', isLoggedin);
    localStorage.setItem('user_name', user_name);
  };


  return (
    <GoogleOAuthProvider clientId="19918831208-tedq0rkmeus8j7lgo8ginorig6ekqt6s.apps.googleusercontent.com">
      <RecoveryContext.Provider value={{ Email, setEmail, OTP, setOTP, user_name, User_Id, isLoggedin, setIsLoggedin, imageUrl, setImageUrl, BackendUrl, setUser_Id, setUsername, setcustomPlaces, customPlaces, currentTrip, setCurrentTrip, CurrentTripId, setCurrentTripId,expenses, setExpenses }}>
        <BrowserRouter>
          <AppContent isLoggedin={isLoggedin} handleLogin={handleLogin} />
        </BrowserRouter>
      </RecoveryContext.Provider>
    </GoogleOAuthProvider>
  );
}

function AppContent({ isLoggedin, handleLogin }) { //extra fun is used to wrap the location inside the browser router
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/detail/') || location.pathname.startsWith('/customPlace') || location.pathname.startsWith('/manage-trip/') || location.pathname.startsWith('/addexpense') || location.pathname.startsWith('/settings') || location.pathname.startsWith('/ForgotPage') || location.pathname.startsWith('/Reset') || location.pathname.startsWith('/OtpPage');
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={isLoggedin ? <Trips /> : <Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Signin" element={<SignIn SignIn={handleLogin} />} />
        <Route
          path="/Trips"
          element={
            <ProtectedRoute isLoggedin={isLoggedin}>
              <Trips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MyTrips"
          element={
            <ProtectedRoute isLoggedin={isLoggedin}>
              <MyTrips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Report"
          element={
            <ProtectedRoute isLoggedin={isLoggedin}>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route path="/Signup" element={<Signup onSignUp={handleLogin} />} />
        <Route path="/OtpPage" element={<Otp />} />
        <Route path="/Reset" element={<Reset />} />
        <Route path="/ForgotPage" element={<ForgotPage />} />
        <Route path="/oauth2callback" element={<OAuthCallback />} />
        <Route path="/detail/:id" element={<PlaceDetails />} />
        <Route path="/customPlace" element={<CustomPlace />} />
        <Route path='/manage-trip/:id' element={<ManageTrip />} />
        <Route path='/addexpense' element={<AddExpenses />} />
        <Route path='/settings' element={<Settings />}></Route>
      </Routes>
    </>
  );
}

export default App;
