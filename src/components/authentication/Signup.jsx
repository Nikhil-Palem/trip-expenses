import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import './Signup.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';
import { RecoveryContext } from '../../App';
import Lottie from "lottie-react";
import animationData from '../../images/loading-animation.json';

function Signup({ onSignUp }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [Email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const [Loading, setLoading] = useState(false);
    const [visibility, setVisibility] = useState(false)
    const [id, setId] = useState(1)
    const navigate = useNavigate();

    const { setImageUrl, BackendUrl } = useContext(RecoveryContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password.length < 8) {
            setErrorMessage("password must be atleast 8 characters");
            setPassword("");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
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
            setErrorMessage("");


            try {
                const response = await axios.post(`${BackendUrl}/signup`, {
                    username: username,
                    password: password,
                    Email: Email,
                });
                if (response.data.error) {
                    setErrorMessage(response.data.error);
                } else {
                    setId(response.data.user_id);
                    onSignUp(response.data.user_id, response.data.username, response.data.Email);
                    navigate("/Trips");
                }

            } catch (error) {
                console.log("this is catch error", error);
            }
            finally {
                setLoading(false);
            }
            setPassword('');
            setUsername('');
            setEmail('');
        }
    };

    const handleChange = (e) => {
        const email = e.target.value.toLowerCase();
        setEmail(email);
    }

    const handleVisibility = () => {
        setVisibility(!visibility);

    }

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const idToken = credentialResponse.credential;

            const res = await axios.post(`${BackendUrl}/google-signUp`, {
                token: idToken,
            });

            if (res.data.errorMessage) {
                setErrorMessage(res.data.errorMessage);
            } else {
                const { user_id, username, profile_url, email } = res.data.user;
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('username', username);
                // localStorage.setItem('profile_url', profile_url);
                localStorage.setItem('email', email);
                setId(user_id);
                onSignUp(user_id, username, email);
                localStorage.setItem('imageUrl', profile_url);
                setImageUrl(profile_url);
                navigate("/Trips");
            }
        } catch (error) {
            console.error("Google signup error:", error?.response || error.message || error);
            setErrorMessage("Google SignUp failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: '19918831208-tedq0rkmeus8j7lgo8ginorig6ekqt6s.apps.googleusercontent.com',
            callback: handleGoogleLoginSuccess,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-signup-btn"),
            {
                theme: "outline",
                size: "large",
                text: "signup_with",
                shape: "square",
            }
        );
    }, []);


    return (
        <div className="centered-container">
            {!Loading ? <div className='login-div small-Boxes'>
                <h1>Create an account</h1>
                <p className='Cp'>connect your friends today!</p>
                <p> <span className='signup-hylyt'>Sign Up </span>to continue</p>
                <form className='login-form' onSubmit={handleSubmit} >

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
                    <div className="hr-container">
                        <hr />
                        <span className="or-text boxP">or</span>
                    </div>

                    <div id="google-signup-btn"></div> { }

                    <span className='login-span'>Already a member? <Link to="/Signin">Log In</Link> </span>
                    {errorMessage && <p style={{ color: "red", fontSize: "12px" }}> {errorMessage} </p>}
                </form>
            </div> : <div className="loader">
                <Lottie animationData={animationData} loop={true} />
            </div>}
        </div>
    )
}

export default Signup