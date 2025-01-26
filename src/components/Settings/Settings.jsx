import React, { useState } from 'react'
import Sidebar from './Sidebar'
import './Settings.css'
import ProfileView from './ProfileView'
import AccountManagement from './AccountManagement'
import PrivacySecurity from './PrivacySecurity'
import PersonalDetails from './PersonalDetails'
import TripPreferences from './TripPreferences'
function Settings() {
  const [Active, setActive] = useState('profile');
  // using the state we need to get the TS PS from the sidebar and that will get display beside the sidebar using  && operation based on which is active
  return (
    <div className='settings-container boxes'>
      <div className="sidebar">
        <Sidebar Active={Active} setActive={setActive} />
      </div>
      <div className="sidebar-views">
        {Active === 'profile' && <ProfileView />}
        {Active === 'PS' && <PersonalDetails />}
        {Active === 'PandS' && <PrivacySecurity />}
        {Active === 'TP' && <TripPreferences />}
        {Active === 'AS' && <AccountManagement />}
      </div>
    </div>
  )
}

export default Settings