import React from 'react'
import './ProfileView.css'; //bcz of similar styling i have used this css
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useNavigate } from 'react-router-dom';
function PersonalDetails() {
  const navigate=useNavigate();
  return (
    <div className='profile-view-container'>
      <div className="profile-view-header">
        <h3>Personal Details</h3>
        <CloseTwoToneIcon className='mui_icon boxH' onClick={() => navigate('/Trips')} />
      </div>
      <div className="edit_profile_container">
        <div className="edit_profile_details">
          <div className="phoneno">
            <label htmlFor="Phoneno">Phoneno</label>
            <input type="text" name="phoneno" id="" placeholder='enter phone no' />
          </div>
          <div className="address">
            <label htmlFor="address">Address</label>
            <textarea type="address" name="address" id="" placeholder='enter address' />
          </div>
          <div className="DOB">
            <label htmlFor="DOB">DOB</label>
            <input type="date" name="dob" id="" />
          </div>
          <button className='edit_profile_btn' type="submit">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default PersonalDetails