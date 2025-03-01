import React, { useContext, useState } from 'react'
import './PrivacySecurity.css'
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RecoveryContext } from '../../App';
import Lottie from "lottie-react";
import BtnAnimation from '../../images/button-animation.json';
function PrivacySecurity() {
  const navigate = useNavigate();
  const [Show, setShow] = useState('');
  const [CurrPswd, setCurrPswd] = useState('');
  const [Loading, setLoading] = useState(false);
  const [NewPswd, setNewPswd] = useState('');
  const [ReNewPswd, setReNewPswd] = useState('');
  const [ErrorMsg, setErrorMsg] = useState('');
  const { BackendUrl, User_Id } = useContext(RecoveryContext);

  const handleCPswd = async () => {
    setLoading(true);
    try {
      if (NewPswd !== ReNewPswd) {
        setErrorMsg('New password and retyped password do not match');
        return;
      }
      const resp = await axios.put(`${BackendUrl}/changePswd`, {
        currPswd: CurrPswd,
        newPswd: NewPswd,
        User_Id: User_Id
      })
      if (resp.data.status === 200) {
        setErrorMsg('Password changed successfully');
      } else {
        setErrorMsg(resp.data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='privacy-security-container'>
      <div className="privacy-sec-header">
        <h3>Password and security</h3>
        <CloseTwoToneIcon className='mui_icon boxH' onClick={() => navigate('/Trips')} />
      </div>
      <div className="ps-div">
        <div className="privacy-security-innbox">
          <h4>Login & recovery</h4>
          <p>Manage your passwords, login preferences and recovery methods.</p>
          <div className="changePsw-Recovery">
            <h5 className='boxH' onClick={() => setShow('CP')}>Change Password<KeyboardArrowRightSharpIcon /></h5>
            <h5 className='boxH' onClick={() => setShow('AR')}>Account Recovery<KeyboardArrowRightSharpIcon /></h5>
          </div>
        </div>
      </div>
      {
        Show == 'CP' && (
          <div className="overlay">
            <div className="changePswd small-Boxes">
              <CloseTwoToneIcon className='mui_icon boxH' onClick={() => setShow('')} />
              <h1>Change password</h1>
              <p>Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%).</p>
              <label htmlFor="currpswd">Current password</label>
              <input type="text" name='currentpswd' placeholder='enter current password' onChange={(e) => setCurrPswd(e.target.value)} />
              <label htmlFor="currpswd">New password</label>
              <input type="text" name='newpswd' placeholder='enter new password' onChange={(e) => setNewPswd(e.target.value)} />
              <label htmlFor="currpswd">Re-type new password</label>
              <input type="text" name='currentpswd' placeholder='Re-type new password' onChange={(e) => setReNewPswd(e.target.value)} />
              <NavLink to={"/ForgotPage"}>Forgot Password?</NavLink>
              <button className='recovery_btn' type="submit" onClick={handleCPswd}>{!Loading ? "Change Password" : <div className="loader">
                <Lottie style={{ height: "18px" }} animationData={BtnAnimation} loop={true} />
              </div>}</button>
              {setErrorMsg && <>
                <p style={{ color: "red" }}>{ErrorMsg}</p>
              </>}
            </div>
          </div>
        )
      }
      {Show == 'AR' && (
        <div className="overlay">
          <div className="accountrecovery small-Boxes">
            <CloseTwoToneIcon className='mui_icon boxH' onClick={() => setShow('')} />
            <h1>Account Recovery</h1>
            <p>Set up your account recovery options to help you regain access to your account if you forget your password.</p>
            <label htmlFor="recoveryEmail">Recovery Email</label>
            <input type="email" name='recoveryEmail' placeholder='Enter recovery email' />
            <label htmlFor="recoveryPhone">Recovery Phone</label>
            <input type="tel" name='recoveryPhone' placeholder='Enter recovery phone number' />
            <label htmlFor="securityQuestion">Security Question</label>
            <select name="securityQuestion">
              <option value="">Select a security question</option>
              <option value="pet">What is your pet's name?</option>
              <option value="school">What is the name of your first school?</option>
              <option value="city">In what city were you born?</option>
            </select>
            <label htmlFor="securityAnswer">Answer</label>
            <input type="text" name='securityAnswer' placeholder='Enter your answer' />
            <button className='recovery_btn' type="submit">Save</button>
          </div>
        </div>
      )
      }
    </div>

  )
}

export default PrivacySecurity