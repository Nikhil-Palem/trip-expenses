
import React, { useState, useEffect, useContext } from 'react'
import './SignIn.css'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';
import { RecoveryContext } from '../../App';
import { GoogleLogin } from '@react-oauth/google';

function SignIn({ SignIn }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [visibility, setVisibility] = useState(false)
  const [id, setId] = useState(1)
  const navigate = useNavigate();
  const { imageUrl, setImageUrl, BackendUrl } = useContext(RecoveryContext);
  const handleVisibility = () => {
    setVisibility(!visibility);
  }

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BackendUrl}/signIn`, {
        username: username,
        password: password
      });
      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        setId(response.data.user_id);
        SignIn(response.data.user_id, response.data.username);
        setImageUrl(response.data.profile_url);
        console.log("login page", response.data.user_id);
        navigate("/PaidPage");
      }

    } catch (error) {
      console.log("this is catch error", error.message);
    }
    setPassword('');
    setUsername('');

  }

  const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential;
    try {
      const response = axios.post(`${BackendUrl}/google-signIn`, { token });
      if (response.data.success) {
        setId(response.data.user_id);
        SignIn(response.data.user_id, response.data.username);
        setImageUrl(response.data.profile_url);
        console.log("login page", response.data.user_id);
        navigate("/PaidPage");
      } else {
        setErrorMessage('Google SignIn failed');
      }
    } catch (error) {
      console.log('Error during Google Sign-In', error);
      setErrorMessage('Google Sign-In failed');
    }
  }

  const handleGoogleLoginFail = (error) => {
    console.log(error);
    setErrorMessage('Google signIn failed');
  }

  return (
    <div className="sigin_centered_conatiner">
      <div className='container'>
        <h1>Hello Welcome back!</h1>
        <p><span className='signin-hylyt'>Sign In </span> to continue</p>
        <form action="" className='signin-form' onSubmit={submitLogin}>

          <label htmlFor="signin-username">username</label>
          <div className='signin-input-username'>
            <input type="text" name="username" placeholder='Enter username' required autoComplete="username" onChange={(e) => setUsername(e.target.value)} value={username} />
          </div>

          <label htmlFor="signin-password">password</label>
          <div className='sigin-input-password'>
            <input type={visibility ? "text" : "password"} value={password} name="password" placeholder='Enter 8 characters or more' required autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
            <span onClick={handleVisibility}>{!visibility ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}</span>
          </div>

          <a><Link to="/ForgotPage"><span>Forgot Password?</span></Link></a>
          <input type="submit" value="Sign In" className="submit" />
          <section className="hr-container">
            <hr />
            <span className="or-text">or</span>
          </section>
          {/* <section className="login-with"> */}
          <GoogleLogin onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFail} />
          <section className='facebook'>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.33333 19.8889C3.61111 19.0556 0 14.9444 0 10C0 4.5 4.5 0 10 0C15.5 0 20 4.5 20 10C20 14.9444 16.3889 19.0556 11.6667 19.8889L11.1111 19.4444H8.88889L8.33333 19.8889Z" fill="url(#paint0_linear_718_10829)"></path><path d="M13.8891 12.7776L14.3335 9.99978H11.6668V8.05534C11.6668 7.27756 11.9446 6.66645 13.1668 6.66645H14.4446V4.11089C13.7224 3.99978 12.9446 3.88867 12.2224 3.88867C9.94461 3.88867 8.3335 5.27756 8.3335 7.77756V9.99978H5.8335V12.7776H8.3335V19.8331C8.88905 19.9442 9.44461 19.9998 10.0002 19.9998C10.5557 19.9998 11.1113 19.9442 11.6668 19.8331V12.7776H13.8891Z" fill="white"></path><defs><linearGradient id="paint0_linear_718_10829" x1="10" y1="19.3078" x2="10" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#0062E0"></stop><stop offset="1" stop-color="#19AFFF"></stop></linearGradient></defs></svg>
            <span>Signin with Facebook</span>
          </section>
          {/* </section> */}
          <span className='signin-span'>Don't have an Account? <Link to="/Signup">Sign Up</Link> </span>
          {errorMessage && <p style={{ color: "red", fontSize: "12px" }}> {errorMessage} </p>}
        </form>
      </div>
    </div>
  )
}

export default SignIn