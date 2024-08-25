
import React, { useState, useEffect, useContext } from 'react'
import './SignIn.css'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';
import { RecoveryContext } from '../../App';

function SignIn({ SignIn }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [visibility, setVisibility] = useState(false)
  const [id, setId] = useState(1)
  const navigate = useNavigate();
  const {  imageUrl, setImageUrl } = useContext(RecoveryContext);
  const handleVisibility = () => {
    setVisibility(!visibility);
  }

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/signIn", {
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
          <span className='signin-span'>Don't have an Account? <Link to="/Signup">Sign Up</Link> </span>
          {errorMessage && <p style={{ color: "red", fontSize: "12px" }}> {errorMessage} </p>}
        </form>
      </div>
    </div>
  )
}

export default SignIn