import React, { useContext, useState } from 'react';
import './ForgotPage.css';
import { RecoveryContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LockResetIcon from '@mui/icons-material/LockReset';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
function ForgotPage() {
  const { Email, setEmail, setOTP, BackendUrl ,isLoggedin} = useContext(RecoveryContext);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const handleForgot = async (e) => {
    e.preventDefault();
    if (Email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      setOTP(OTP);
            try {
        const response = await axios.post(
          ` ${BackendUrl}/send_recovery_email`,
          { Email, OTP },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data.success) {
          navigate('/OtpPage');
        } else {
          setErrorMessage(response.data.error || "Failed to send recovery email");
        }
      } catch (error) {
        console.error("Error sending recovery email:", error);
        setErrorMessage("Failed to send recovery email");
      }
    } else {
      setErrorMessage("Please enter a valid email address");
    }
  };

  return (
    <div className="forgot-page ">
      <div className="forgot-page-div small-Boxes">
        <span><LockResetIcon className='mui_icon_fp' /></span>
        <h2>Forgot Password</h2>
        <p>Enter your email we will send you a OTP to reset your password.</p>
        <form onSubmit={handleForgot}>
          <input
            type="email"
            placeholder="Enter your email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className='forgot_pswd_Btn' type="submit">Send OTP</button>
        </form>
        <span onClick={()=>isLoggedin?navigate('/settings'):navigate('/Signin')}><KeyboardArrowLeftRoundedIcon />{!isLoggedin? "Back to Login":"Back to Settings"}</span>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

    </div>
  );
}

export default ForgotPage;