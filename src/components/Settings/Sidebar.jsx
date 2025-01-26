import React from 'react';
import { IdentificationIcon, RocketLaunchIcon, ShieldCheckIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import './Sidebar.css';

function Sidebar({ Active, setActive }) {

  return (
    <div className='sidebar-container boxborderright'>
      <h3>Account Settings</h3>
      <p>Manage Your Account Settings</p>
      <div className="sidebar-contents">
        <div className={`profile boxH ${Active === 'profile' ? "active boxactive" : ""}`} onClick={()=>setActive('profile')}>
          <span className='icon'><UserIcon /></span>
          <span>Edit Profile</span>
        </div>
        <div className={`personaldetails boxH ${Active === 'PS' ? "active boxactive" : ""}`} onClick={() => setActive('PS')}>
          <span className='icon'><IdentificationIcon /></span>
          <span>Personal Details</span>
        </div>
        <div className={`password-security boxH ${Active === 'PandS' ? "active boxactive" : ""}`} onClick={() => setActive('PandS')}>
          <span className='icon'><ShieldCheckIcon /></span>
          <span>Password & security</span>
        </div>
        <div className={`trip-preferences boxH ${Active === 'TP' ? "active boxactive" : ""}`} onClick={() => setActive('TP')}>
          <span className='icon'><RocketLaunchIcon /></span>
          <span>Trip Preferences</span>
        </div>
        <div className={`account-settings boxH ${Active === 'AS' ? "active boxactive" : ""}`} onClick={() => setActive('AS')}>
          <span className='icon'><UserCircleIcon /></span>
          <span>Account Settings</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;