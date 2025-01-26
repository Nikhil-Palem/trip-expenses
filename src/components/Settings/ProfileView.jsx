import React, { useContext } from 'react'
import './ProfileView.css';
import CustomAvatar from '../SubTasks/CustomAvatar';
import { RecoveryContext } from '../../App';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useNavigate } from 'react-router-dom';
//all views of sidebar need to complete by this week
function ProfileView() {
  const { imageUrl, user_name, Email } = useContext(RecoveryContext);
  const navigate=useNavigate();
  return (
    <div className='profile-view-container'>
      <div className="profile-view-header">
        <h3>Edit Profile</h3>
        <CloseTwoToneIcon className='mui_icon boxH' onClick={() => navigate('/Trips')} />
      </div>
      <div className="edit_profile_container">
        <div className="profile_view boxbgLight" >
          <div className="profile_left">
            <CustomAvatar imgUrl={imageUrl} name={user_name} height={50} width={50} />
            <div className="profile_left_content">
              <p>{user_name}</p>
              <p>{Email}@gmail.com</p>
            </div>
          </div>
          <div className="profile_right">
            <button>Change Photo</button>
          </div>
        </div>
        <div className="edit_profile_details">
          <div className="gender">
            <label htmlFor="Gender">Gender</label>
            <select name="gender" id="">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="username">
            <label htmlFor="Username">Username</label>
            <input type="text" name="username" id="" placeholder='enter username'/>
          </div>  
          <div className="email">
            <label htmlFor="Email">Email</label>
            <input type="email" name="email" id="" placeholder='enter email' />
          </div>
          <div className="lang">
            <label htmlFor="Language">Language</label>
            <select name="language" id="">
              <option value="telugu">Telugu</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>
          <button className='edit_profile_btn' type="submit">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default ProfileView