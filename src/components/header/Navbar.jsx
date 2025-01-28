import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { useNavigate } from 'react-router-dom';
import { RecoveryContext } from '../../App';
// import { Avatar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Logo from '../../images/logo.png';
import NavMenu from './NavMenu';
import DashboardNav from './DashboardNav';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CustomAvatar from '../SubTasks/CustomAvatar';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const [dropdown, setdropdown] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState('');
  const [ULine, setULine] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { isLoggedin, setIsLoggedin, user_name, imageUrl, setUser_Id, setUsername, Email, setEmail,BackendUrl } = useContext(RecoveryContext);
  const navLinksRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const accountIconRef = useRef(null);
  const logoutRef = useRef(null);
  const [ReportText, setReportText] = useState('');
  const [Appearance, setAppearance] = useState(false);
  const [selectedMode, setSelectedMode] = useState(localStorage.getItem('mode') || 'LightMode');


  useEffect(() => {
    document.body.classList.toggle('dark-mode', selectedMode === 'DarkMode');
    localStorage.setItem('mode', selectedMode);
  }, [selectedMode]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('Email');
    const savedUsername = localStorage.getItem('username');

    if (savedEmail) {
      setEmail(savedEmail);
      console.log("saved", savedEmail);
    }
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    setdropdown(prevState => !prevState);
  };

  // const handleLogout = (e) => {
  //   e.preventDefault();
  //   setShowConfirm(true);
  // };

  const handleConfirm = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('loggedin');
    localStorage.removeItem('currentTrip');
    localStorage.removeItem('customPlaces');
    localStorage.removeItem('imageUrl');
    localStorage.removeItem('Email');
    // localStorage.removeItem('OTP');
    localStorage.removeItem('BackendUrl');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('user_name');
    setIsLoggedin(false);
    setUser_Id(0);
    setUsername('');
    setShowConfirm(false);
    navigate("/home");
  };

  const handleCanel = () => {
    setShowConfirm(false);
  };

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
  };

  // Handle clicks outside of dropdown menu and the logout button
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdown && !isLoggedin ?
          (navLinksRef.current && !navLinksRef.current.contains(e.target)) :
          !accountIconRef.current.contains(e.target) && //purpose of this is when clicked on account icon it returns true other the accoutn icon elem is clicked it will return false so when i clicked on accicon it will return true it makes !true ==false and goes for toggle fun and converts the false to true and vice versa so it works only when i keep this without this if i click on the account icon this use effect consider it as outside of elems and the all conds return true and set the dropdown to false and even i am using toggle fun it will not effect to close the dropdown bcz this useeffect will return false bcz it always consider iam clicking outside of navmenu ,accmenu and logout button if i not mention  !accountIconRef.current.contains(e.target) condition
          !accountDropdownRef.current.contains(e.target) &&
          !logoutRef.current.contains(e.target)
      ) {
        setdropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown]);

  const handledropDown = (menu) => {
    setdropdown(false);
    setULine(menu);
  };

  useEffect(() => {
    const savedMenu = localStorage.getItem('selectedMenu');
    const savedDropdown = localStorage.getItem('dropdownVisible');

    if (savedMenu) {
      setULine(savedMenu);
    }

    if (savedDropdown === 'true') {
      setdropdown(true);
    }
  }, []);

  useEffect(() => {
    // Save selected menu item and dropdown visibility to localStorage
    if (ULine) {
      localStorage.setItem('selectedMenu', ULine);
    }
    localStorage.setItem('dropdownVisible', dropdown);
  }, [ULine, dropdown]);

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const handleAppearance = () => {
    setAppearance(!Appearance);
  }

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleReportChange = (e) => {
    setReportText(e.target.value);
  }

  const handleReportProblem = async (e) => {
    e.preventDefault();
    console.log(Email);
    setShowConfirm('');
    if (Email) {
      try {
        const response = await axios.post(`${BackendUrl}/report_problem`, { Email, ReportText, user_name }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data.success) {
          console.log("Report sent successfully");
        } else {
          console.log("Failed to send report");
        }
      }
      catch (err) {
        console.log(err);
      }
    } else {
      console.log("Please enter a valid email address");
    }
  }

  return (
    <div className='navbar'>
      {dropdown && <div className="overlay"></div>}
      <nav>
        <div className="nav-header">
          <div className="logoName">
            <NavLink to={!isLoggedin ? "/home" : ""}> <img className="travelExpenses-logo invert-img" src={Logo} alt="img" /></NavLink>
            <NavLink to={!isLoggedin ? "/home" : ""} className="travel-logo boxTC">Travel Book</NavLink>
          </div>

          {!isLoggedin && isMobile && (
            <div className="hamburger" onClick={toggleMenu}>
              {!dropdown ? <MenuOpenIcon /> : <CancelIcon />}
            </div>
          )}
        </div>

        <div ref={navLinksRef} className={`nav-links ${!dropdown && isMobile ? "" : "show-menu"}`}>
          {!isLoggedin ? (
            <NavMenu ULine={ULine} handledropDown={handledropDown} isMobile={isMobile} />
          ) : (
            <DashboardNav ULine={ULine} setULine={setULine} handledropDown={handledropDown} isMobile={isMobile} />
          )}
        </div>

        {isLoggedin && (
          <div className='account-container'>
            <NavLink className={"logout"} onClick={handleToggle} ref={accountIconRef}>
              <CustomAvatar imgUrl={imageUrl} name={user_name} height={40} width={40} />
            </NavLink>

            <div ref={accountDropdownRef} className={`dropdown-menu ${dropdown ? 'active' : ""} boxes`} onClick={(e) => e.stopPropagation()}>
              <div className="profile-drop">
                <CustomAvatar imgUrl={imageUrl} name={user_name} height={60} width={60} />
                <h3 className='boxTC'>{user_name}</h3>
              </div>
              <hr style={{ border: "1px solid #ccc", margin: "0" }} />

              <div className="dropdown-items">
                <NavLink to="/settings" className="dropdown-item boxH"><RecentActorsIcon onClick={handledropDown} />Profile</NavLink>
                <div className={`dropdown-item boxH`} onClick={handleAppearance}>
                  <div className='DL-icon'>
                    {selectedMode === 'DarkMode' ? <DarkModeIcon /> : <LightModeIcon />}
                    Appearance
                  </div>
                  <span className={`right ${Appearance ? 'change' : ''}`}><KeyboardArrowRightIcon /></span>
                </div>
                <div className={`appearance-div ${Appearance ? 'open' : ''}`}>
                  <span className='boxH' onClick={() => handleModeSelect('DarkMode')}><DarkModeIcon />  DarkMode</span>
                  <span className='boxH' onClick={() => handleModeSelect('LightMode')}><LightModeIcon />  LightMode</span>
                </div>
                <span className="dropdown-item boxH" onClick={() => setShowConfirm('reportproblem')}><ReportGmailerrorredIcon />Report a Problem</span>
                <NavLink to="/settings" className="dropdown-item boxH"><SettingsIcon onClick={handledropDown} />Settings</NavLink>
                <div className="dropdown-item boxH" ref={logoutRef} onClick={() => setShowConfirm('logout')}><LogoutIcon />Logout</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {ShowConfirm == 'logout' && <div className="confirm-container">
        <div className="confirm-box small-Boxes">
          <p>Are you sure you want to logout?</p>
          <div className="confirm-buttons">
            <button className='confirm' onClick={handleConfirm}>Yes</button>
            <button className='cancel' onClick={handleCanel}>No</button>
          </div>
        </div>
      </div>}

      {ShowConfirm == 'reportproblem' && (
        <div className="confirm-container">
          <div className="reportproblem small-Boxes">
            <CloseTwoToneIcon className='mui_icon boxH' onClick={() => setShowConfirm('')} />
            <h1>Report a problem</h1>
            <textarea rows={5} name="reportproblem" placeholder='please include as much info as possible...' id="" onChange={handleReportChange} />
            <button className='report_btn' type="submit" onClick={handleReportProblem}>Send Report</button>
            <span>Your Trips Expense username and browser information will be automatically included in your report.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
