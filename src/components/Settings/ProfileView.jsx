import React, { useContext, useState } from 'react'
import './ProfileView.css';
import CustomAvatar from '../SubTasks/CustomAvatar';
import { RecoveryContext } from '../../App';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//all views of sidebar need to complete by this week
function ProfileView() {
  const { imageUrl, user_name, setUsername, Email, setEmail, User_Id, BackendUrl } = useContext(RecoveryContext);
  const [Name, setName] = useState('');
  const [UserEmail, setUserEmail] = useState('');
  const [Lang, setLang] = useState('English');
  const [Gender, setGender] = useState('male');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("lang and gender", Lang, Gender);
    try {
      const updatedData = {
        User_Id: User_Id,
        name: Name,
        email: UserEmail,
        url: imageUrl,
        lang: Lang,
        gender: Gender
      };

      const resp = await axios.put(`${BackendUrl}/profile_update`, updatedData);
      setName('');
      setUserEmail('');
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

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
              <p>{Email}</p>
            </div>
          </div>
          <div className="profile_right">
            <button>Change Photo</button>
          </div>
        </div>
        <div className="edit_profile_details">
          <div className="gender">
            <label htmlFor="Gender">Gender</label>
            <select name="gender" value={Gender} id="" onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="username">
            <label htmlFor="Username">Username</label>
            <input type="text" value={Name} onChange={(e) => setName(e.target.value)} name="username" id="" placeholder='enter username' />
          </div>
          <div className="email">
            <label htmlFor="Email">Email</label>
            <input type="email" value={UserEmail} name="email" id="" placeholder='enter email' onChange={(e) => setUserEmail(e.target.value)} />
          </div>
          <div className="lang">
            <label htmlFor="Language">Language</label>
            <select name="language" id="" value={Lang} onChange={(e) => setLang(e.target.value)}>
              <option value="telugu">Telugu</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>
          <button className='edit_profile_btn' type="submit" onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default ProfileView