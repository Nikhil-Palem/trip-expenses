import React, { useState, useContext, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { useNavigate } from 'react-router-dom';
import { RecoveryContext } from '../../App';
import { Avatar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import FestivalSharpIcon from '@mui/icons-material/FestivalSharp';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import ContactPhoneTwoToneIcon from '@mui/icons-material/ContactPhoneTwoTone';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationTwoToneIcon from '@mui/icons-material/AppRegistrationTwoTone';

function Navbar() {
  const [isAcitvePage, setAcitvePage] = useState(false);
  const [dropdown, setdropdown] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { isLoggedin, setIsLoggedin, user_name, imageUrl } = useContext(RecoveryContext);
  const dropdownRef = useRef(null);
  const handleToggle = () => {
    setdropdown(!dropdown);
  }
  const handleConfirm = () => {
    navigate("/home");
    setShowConfirm(false);
    setIsLoggedin(false);
  }
  const handleCanel = () => {
    setShowConfirm(false)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setdropdown(!dropdown);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setdropdown(false);  
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handledropDown = () => {
    setdropdown(false);
  }

  return (
    <div className='navbar'>
      {dropdown && <div className="overlay"></div>}
      <nav>
        <div className="nav-header">
          <NavLink to={!isLoggedin ? "/home" : ""} className="travel-logo">Travel Book</NavLink>
          {!isLoggedin && (
            <div className="hamburger" onClick={toggleMenu}>
              {!dropdown ? <MenuOpenIcon /> : <CancelIcon />}
            </div>
          )}
        </div>

        <div ref={dropdownRef} className={`nav-links ${!dropdown && isMobile ? "" : "show-menu"}`}>
          {!isLoggedin ? (
            <div className="info">
              <a href="/home" className='common' onClick={handledropDown}><HomeTwoToneIcon/> Home</a>
              <a href="#About" className='common' onClick={handledropDown}><InfoTwoToneIcon/> About Us</a>
              <a href="#Contact" className='common' onClick={handledropDown}><ContactPhoneTwoToneIcon/> Contact</a>
              <NavLink to="/Signin" className='common' onClick={handledropDown}><LoginIcon/> Signin</NavLink>
              <NavLink to="/Signup" style={{ border: "2px solid white" }} className='common' onClick={handledropDown}><AppRegistrationTwoToneIcon/> Register</NavLink>
            </div>
          ) : (
            !isMobile && (
              <div className="pages">
                <NavLink to="/PaidPage" className={!isAcitvePage ? "PaidPage" : "common"} onClick={() => setAcitvePage(false)}>PaidPage</NavLink>
                <NavLink to="/TourPage" className={isAcitvePage ? "TourPage" : "common"} onClick={() => setAcitvePage(true)}>TourPage</NavLink>
              </div>
            )
          )}

        </div>

        {isLoggedin && (<div className='account-conatiner'>
          <NavLink className={"logout"} onClick={handleToggle}><Avatar
            src={imageUrl || ''}
            alt={user_name}
            sx={{ width: 40, height: 40 }}
          >
            {!imageUrl && <AccountCircleIcon className='profile-icon' style={{ fontSize: "60px" }} />}
          </Avatar></NavLink>
          <div ref={dropdownRef} className={`dropdown-menu ${dropdown ? 'active' : ""}`}>
            <div className="profile-drop">
              <Avatar
                src={imageUrl || ''}
                alt={user_name}
                sx={{ width: 60, height: 60 }}
              >
                {!imageUrl && <AccountCircleIcon className='profile-icon' style={{ fontSize: "70px" }} />}
              </Avatar>
              <p>Hi,<span style={{ color: "#198754" }}>{user_name}</span></p>
            </div>
            <hr style={{ border: "1px solid #ccc", margin: "0" }} />
            {isMobile && (<>
              <NavLink to="/PaidPage" className={!isAcitvePage ? "PaidPage" : "commonmobile"} onClick={handledropDown}><PaidOutlinedIcon /> PaidPage</NavLink>
              <NavLink to="/TourPage" className={isAcitvePage ? "TourPage" : "commonmobile"} onClick={handledropDown}><FestivalSharpIcon /> TourPage</NavLink>
            </>)
            }
            <NavLink to="/Profile" className="dropdown-item"><RecentActorsIcon onClick={handledropDown} />Profile</NavLink>
            <NavLink to="/Settings" className="dropdown-item"><SettingsIcon onClick={handledropDown} />Settings</NavLink>
            <NavLink to="/home" className="dropdown-item" onClick={(e) => { e.preventDefault(); setShowConfirm(true); }}><LogoutIcon />Logout</NavLink>
          </div>
        </div>)}
      </nav>
      {ShowConfirm && <div className="confirm-container">
        <div className="confirm-box">
          <p>Are you sure you want to logout?</p>
          <div className="confrim-buttons">
            <button className='confirm' onClick={handleConfirm}>Yes</button>
            <button className='cancel' onClick={handleCanel}>No</button>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Navbar