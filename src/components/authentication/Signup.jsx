import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import './Signup.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';
import { RecoveryContext } from '../../App';

function Signup({ onSignUp }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [Email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [visibility, setVisibility] = useState(false)
    const [id, setId] = useState(1)
    const navigate = useNavigate();

    const { BackendUrl } = useContext(RecoveryContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            setErrorMessage(""); // Clear error message
            // const credentials = { username, password };
            // console.log(username,password);
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
                    onSignUp(response.data.user_id, response.data.username);
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
    const handleChange = (e) => {
        const email = e.target.value.toLowerCase();
        setEmail(email);
    }

    const handleVisibility = () => {
        setVisibility(!visibility);

    }
    return (
        <div className="centered-container">
            <div className='login-div'>
                <h1>Create an account</h1>
                <p className='Cp'>connect your friends today!</p>
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
                    <section className="hr-container">
                        <hr />
                        <span className="or-text">or</span>
                    </section>
                    <section className="login-with">
                        <section className="google">
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.1 10.229C20.1 9.51996 20.0363 8.83814 19.9182 8.18359H10.5V12.0518H15.8818C15.65 13.3018 14.9454 14.3609 13.8864 15.07V17.579H17.1182C19.0091 15.8381 20.1 13.2745 20.1 10.229Z" fill="#4285F4"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.491 19.9994C13.191 19.9994 15.4547 19.104 17.1092 17.5767L13.8774 15.0676C12.9819 15.6676 11.8365 16.0221 10.491 16.0221C7.8865 16.0221 5.68195 14.263 4.89559 11.8994H1.55469V14.4903C3.20014 17.7585 6.58195 19.9994 10.491 19.9994Z" fill="#34A853"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.90454 11.8987C4.70454 11.2987 4.5909 10.6578 4.5909 9.99872C4.5909 9.33963 4.70454 8.69872 4.90454 8.09872V5.50781H1.56363C0.886363 6.85781 0.5 8.38508 0.5 9.99872C0.5 11.6124 0.886363 13.1396 1.56363 14.4896L4.90454 11.8987Z" fill="#FBBC05"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.491 3.97727C11.9592 3.97727 13.2774 4.48182 14.3138 5.47273L17.1819 2.60454C15.4501 0.990909 13.1865 0 10.491 0C6.58195 0 3.20014 2.24091 1.55469 5.50909L4.89559 8.1C5.68195 5.73636 7.8865 3.97727 10.491 3.97727Z" fill="#EA4335"></path></svg>
                            <span>Signup with Google</span>
                        </section>
                        <section className='facebook'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.33333 19.8889C3.61111 19.0556 0 14.9444 0 10C0 4.5 4.5 0 10 0C15.5 0 20 4.5 20 10C20 14.9444 16.3889 19.0556 11.6667 19.8889L11.1111 19.4444H8.88889L8.33333 19.8889Z" fill="url(#paint0_linear_718_10829)"></path><path d="M13.8891 12.7776L14.3335 9.99978H11.6668V8.05534C11.6668 7.27756 11.9446 6.66645 13.1668 6.66645H14.4446V4.11089C13.7224 3.99978 12.9446 3.88867 12.2224 3.88867C9.94461 3.88867 8.3335 5.27756 8.3335 7.77756V9.99978H5.8335V12.7776H8.3335V19.8331C8.88905 19.9442 9.44461 19.9998 10.0002 19.9998C10.5557 19.9998 11.1113 19.9442 11.6668 19.8331V12.7776H13.8891Z" fill="white"></path><defs><linearGradient id="paint0_linear_718_10829" x1="10" y1="19.3078" x2="10" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#0062E0"></stop><stop offset="1" stop-color="#19AFFF"></stop></linearGradient></defs></svg>
                            <span>Signup with Facebook</span>
                        </section>
                    </section>
                    <span className='login-span'>Already a member? <Link to="/Signin">Log In</Link> </span>
                    {errorMessage && <p style={{ color: "red", fontSize: "12px" }}> {errorMessage} </p>}
                </form>
            </div>
        </div>
    )
}

export default Signup