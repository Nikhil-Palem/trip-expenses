import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import './Signup.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';

function Signup({ onSignUp }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [Email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [visibility, setVisibility] = useState(false)
    const [id, setId] = useState(1)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setErrorMessage("password must be atleast 8 characters");
            setPassword("");
            return;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)){
            setErrorMessage("Invalid Email address");
            setEmail('');
            setPassword('');
            return;
        }
        if (!/^[a-zA-Z0-9 ]+$/.test(username)) {
            setErrorMessage("Username must not contain special characters");
            setPassword('');
            setUsername('');
            return;
        } else {
            setErrorMessage(""); // Clear error message
            // const credentials = { username, password };
            // console.log(username,password);
            try {
                const response = await axios.post("http://localhost:3000/signup", {
                    username: username,
                    password: password,
                    Email:Email, 
                });
                if (response.data.error) {
                    setErrorMessage(response.data.error);
                } else {
                    setId(response.data.user_id);
                    onSignUp(response.data.user_id,response.data.username);
                    console.log("login page", response.data.user_id);
                    navigate("/PaidPage");
                }

            } catch (error) {
                console.log("this is catch error", error);
            }
            setPassword('');
            setUsername('');
            setEmail('');
        }
    };
    const handleChange=(e)=>{
        const email=e.target.value.toLowerCase();
        setEmail(email);
    }

    const handleVisibility = () => {
        setVisibility(!visibility);

    }
    return (
        <div className="centered-container">
            <div className='login-div'>
                <h1>Hello!</h1>
                <p> <span className='signup-hylyt'>Sign Up </span>to continue</p>
                <form action="" className='login-form' onSubmit={handleSubmit} >

                    <label htmlFor="username">username</label>
                    <div className='input-username'>
                        <input type="text" value={username} name="username" placeholder='Enter username' id={id} onChange={(e) => { setUsername(e.target.value) }} required autoComplete="username" />
                    </div>

                    <label htmlFor="Email">Email</label>
                    <div className='input-email'>
                        <input type="text" value={Email} name="email" placeholder='xyz@gmail.com' id={id} onChange={handleChange} required autoComplete="email" />
                    </div>

                    <label htmlFor="password">password</label>
                    <div className='input-password'>
                        <input type={visibility ? "text" : "password"} value={password} name="password" placeholder='Enter 8 characters or more' id={password} onChange={(e) => { setPassword(e.target.value) }} required autoComplete="current-password" />
                        <span onClick={handleVisibility}>{!visibility ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}</span>
                    </div>

                    <p>By clicking Agree & Join or Continue, you agree to the Travel Book <span className="span-ele">User Agreement, Privacy</span> Policy, and <span className="span-ele">Cookie Policy.</span></p>
                    <input type="submit" value="Agree and join" className="submit" />
                    <span className='login-span'>Already a member? <Link to="/Signin">Log In</Link> </span>
                    {errorMessage && <p style={{ color: "red", fontSize: "12px" }}> {errorMessage} </p>}
                </form>
            </div>
        </div>
    )
}

export default Signup