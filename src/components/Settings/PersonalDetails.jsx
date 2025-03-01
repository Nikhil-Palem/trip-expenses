import React, { useContext, useState } from 'react'
import './ProfileView.css'; //bcz of similar styling i have used this css
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RecoveryContext } from '../../App';
function PersonalDetails() {
  const [PhNo, setPhNo] = useState('');
  const [Address, setAddress] = useState('');
  const [DOB, setDOB] = useState(null); 
  const navigate=useNavigate();
  const {BackendUrl,User_Id}= useContext(RecoveryContext);
  const hanldePersonalDetails=async()=>{
    const resp=await axios.put(`${BackendUrl}/personal_details`,{
      User_Id:User_Id,
      PhNo:PhNo,
      Address:Address,
      DOB:DOB
    })
    setPhNo('');
    setAddress('');
    setDOB('');
    
  }
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
            <input type="text" name="phoneno" value={PhNo} placeholder='enter phone no' onChange={(e)=>setPhNo(e.target.value)}/>
          </div>
          <div className="address">
            <label htmlFor="address">Address</label>
            <textarea type="address" name="address" value={Address} placeholder='enter address'  onChange={(e)=>setAddress(e.target.value)}/>
          </div>
          <div className="DOB">
            <label htmlFor="DOB">DOB</label>
            <input type="date" name="dob" value={DOB}  onChange={(e)=>setDOB(e.target.value)}/>
          </div>
          <button className='edit_profile_btn' type="submit" onClick={hanldePersonalDetails}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default PersonalDetails