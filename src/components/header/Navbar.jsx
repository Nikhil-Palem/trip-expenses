import React, { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { useNavigate } from 'react-router-dom';
import { RecoveryContext } from '../../App';
import { Avatar } from '@mui/material';

function Navbar() {
  const [AcitvePage, setAcitvePage] = useState(false);
  const [dropdown, setdropdown] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { isLoggedin, setIsLoggedin, user_name, imageUrl } = useContext(RecoveryContext);
  const handleClick = () => {
    setAcitvePage(!AcitvePage);
  }
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
  return (
    <div className='navbar'>
      <nav>
        <div className='nav-links'>
          <NavLink to={!isLoggedin ? "/home" : ""} className="travel-logo" >Travel Book</NavLink>
          {isLoggedin && (<>
            <div className="pages">
              <NavLink to="/PaidPage" className={!AcitvePage ? "PaidPage" : "common"} onClick={handleClick}>PaidPage</NavLink>
              <NavLink to="/TourPage" className={AcitvePage ? "TourPage" : "common"} onClick={handleClick}>TourPage</NavLink>
            </div></>
          )}

          {!isLoggedin && (
            <>
              <div className="info">
                <a href="/home" className='common'>Home</a>
                <a href="#About" className='common'>About Us</a>
                <a href="#Contact" className='common'>Contact</a>
                <NavLink to="/Signin" className='common'>Signin</NavLink>
                <NavLink to="/Signup" style={{ border: "2px solid white" }} className='common'>Register</NavLink>
              </div>
            </>
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
          {dropdown && (
            <div className="dropdown-menu">
              <div className="profile-drop">
                <Avatar
                  src={imageUrl || ''}
                  alt={user_name}
                  sx={{ width: 60, height: 60 }}
                >
                  {!imageUrl && <AccountCircleIcon className='profile-icon' style={{ fontSize: "70px" }} />}
                </Avatar>
                <p>Hi,<span style={{color:"#198754"}}>{user_name}</span></p>
              </div>
              <hr style={{ border: "1px solid #ccc", margin: "0" }} />
              <NavLink to="/Profile" className="dropdown-item"><RecentActorsIcon />Profile</NavLink>
              <NavLink to="/Settings" className="dropdown-item"><SettingsIcon />Settings</NavLink>
              <NavLink to="/home" className="dropdown-item" onClick={(e) => { e.preventDefault(); setShowConfirm(true); }}><LogoutIcon />Logout</NavLink>
            </div>
          )}
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